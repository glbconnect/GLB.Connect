import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {Buffer|ReadableStream} fileBuffer - Image file buffer or stream
 * @param {string} folder - Folder name in Cloudinary (e.g., 'posts', 'stories')
 * @param {string} publicId - Public ID for the image (optional, will be auto-generated if not provided)
 * @returns {Promise<{url: string, public_id: string}>}
 */
export const uploadToCloudinary = async (fileBuffer, folder, publicId = null) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: folder,
      resource_type: 'image',
      format: 'auto', // Auto-optimize format
      quality: 'auto', // Auto-optimize quality
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
    }

    // Convert buffer to stream if needed
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve({
            url: result.secure_url, // Use HTTPS URL
            public_id: result.public_id,
          });
        }
      }
    );

    // Handle both Buffer and Stream
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
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<void>}
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    // Extract public_id from URL if full URL is provided
    let actualPublicId = publicId;
    if (publicId.includes('cloudinary.com')) {
      // Extract public_id from Cloudinary URL
      const urlParts = publicId.split('/');
      const uploadIndex = urlParts.findIndex(part => part === 'upload');
      if (uploadIndex !== -1 && urlParts[uploadIndex + 2]) {
        // Get the path after version number
        const pathAfterVersion = urlParts.slice(uploadIndex + 2).join('/');
        actualPublicId = pathAfterVersion.replace(/\.[^/.]+$/, ''); // Remove extension
      }
    }

    const result = await cloudinary.uploader.destroy(actualPublicId);
    if (result.result === 'ok') {
      console.log(`Deleted image from Cloudinary: ${actualPublicId}`);
    } else {
      console.warn(`Failed to delete image from Cloudinary: ${actualPublicId}`, result);
    }
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    // Don't throw - allow deletion to continue even if Cloudinary deletion fails
  }
};

/**
 * Check if Cloudinary is configured
 * @returns {boolean}
 */
export const isCloudinaryConfigured = () => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.USE_CLOUDINARY === 'true'
  );
};

