import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

/**
 * Configure Cloudinary
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file to Cloudinary (Images + PDFs supported)
 * - Images → optimized
 * - PDFs → previewable in browser
 *
 * @param {Buffer|ReadableStream} fileBuffer
 * @param {string} folder
 * @param {string|null} publicId
 * @param {string|null} mimeType
 * @returns {Promise<{url: string, public_id: string}>}
 */
export const uploadToCloudinary = async (
  fileBuffer,
  folder,
  publicId = null,
  mimeType = null
) => {
  return new Promise((resolve, reject) => {

    // ✅ Decide resource type
    let resourceType = 'auto';
    if (mimeType === 'application/pdf') {
      resourceType = 'image'; // REQUIRED for PDF preview
    }

    const uploadOptions = {
      folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
    }

    // ✅ Optimize only real images (NOT PDFs)
    if (resourceType === 'image' && mimeType !== 'application/pdf') {
      uploadOptions.transformation = [
        { fetch_format: 'auto', quality: 'auto' }
      ];
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }

        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    // ✅ Handle Buffer & Stream
    if (Buffer.isBuffer(fileBuffer)) {
      uploadStream.end(fileBuffer);
    } else if (fileBuffer instanceof Readable) {
      fileBuffer.pipe(uploadStream);
    } else {
      reject(new Error('Invalid file buffer or stream'));
    }
  });
};

/**
 * Delete file from Cloudinary (Image / PDF)
 * @param {string} publicIdOrUrl
 */
export const deleteFromCloudinary = async (publicIdOrUrl) => {
  try {
    let actualPublicId = publicIdOrUrl;

    // If full URL is passed
    if (publicIdOrUrl.includes('cloudinary.com')) {
      const urlParts = publicIdOrUrl.split('/');
      const uploadIndex = urlParts.findIndex(p => p === 'upload');

      if (uploadIndex !== -1) {
        actualPublicId = urlParts
          .slice(uploadIndex + 2)
          .join('/')
          .replace(/\.[^/.]+$/, '');
      }
    }

    await cloudinary.uploader.destroy(actualPublicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};

/**
 * Check Cloudinary config
 */
export const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.USE_CLOUDINARY === 'true'
  );
};
