import { SERVER_URL } from '../services/api';

/**
 * Constructs the full file URL for accessing uploaded files
 * @param {string} fileUrl - The relative file URL from the database
 * @returns {string} - The complete file URL
 */
export const getFullFileUrl = (fileUrl) => {
  if (!fileUrl) {
    console.warn('No fileUrl provided');
    return null;
  }

  // If it's already a full URL, return as is
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
    return fileUrl;
  }

  // Ensure the fileUrl starts with /
  const normalizedFileUrl = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`;
  
  // Construct full URL
  const fullUrl = `${SERVER_URL}${normalizedFileUrl}`;
  
  console.log('File URL construction:', {
    original: fileUrl,
    normalized: normalizedFileUrl,
    serverUrl: SERVER_URL,
    fullUrl: fullUrl
  });
  
  return fullUrl;
};

/**
 * Tests if a file is accessible
 * @param {string} fileUrl - The file URL to test
 * @returns {Promise<boolean>} - Whether the file is accessible
 */
export const testFileAccess = async (fileUrl) => {
  try {
    const response = await fetch(fileUrl, { 
      method: 'HEAD',
      mode: 'cors'
    });
    return response.ok;
  } catch (error) {
    console.error('File access test failed:', error);
    return false;
  }
};

/**
 * Gets alternative file URLs to try if the primary fails
 * @param {string} fileUrl - The original file URL
 * @returns {string[]} - Array of alternative URLs to try
 */
export const getAlternativeUrls = (fileUrl) => {
  if (!fileUrl) return [];
  
  const alternatives = [];
  
  // Try with current origin for relative paths only
  if (typeof window !== 'undefined' && fileUrl.startsWith('/')) {
    const currentOrigin = window.location.origin;
    alternatives.push(`${currentOrigin}${fileUrl}`);
  }
  
  // Try with different protocol
  if (fileUrl.startsWith('http://')) {
    alternatives.push(fileUrl.replace('http://', 'https://'));
  } else if (fileUrl.startsWith('https://')) {
    alternatives.push(fileUrl.replace('https://', 'http://'));
  }
  
  return alternatives;
};

/**
 * Handles file download/view with fallback mechanisms
 * @param {string} fileUrl - The file URL
 * @param {string} fileName - The file name for download
 * @param {string} fileType - The file type
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export const handleFileAccess = async (fileUrl, fileName, fileType) => {
  const fullUrl = getFullFileUrl(fileUrl);
  
  if (!fullUrl) {
    throw new Error('Invalid file URL');
  }

  // Test primary URL
  let isAccessible = await testFileAccess(fullUrl);
  
  if (isAccessible) {
    return openFile(fullUrl, fileName, fileType);
  }

  // Try alternative URLs
  const alternatives = getAlternativeUrls(fileUrl);
  
  for (const altUrl of alternatives) {
    console.log('Trying alternative URL:', altUrl);
    isAccessible = await testFileAccess(altUrl);
    
    if (isAccessible) {
      return openFile(altUrl, fileName, fileType);
    }
  }

  throw new Error('File is not accessible from any URL');
};

/**
 * Opens or downloads a file based on its type
 * @param {string} url - The file URL
 * @param {string} fileName - The file name
 * @param {string} fileType - The file type
 */
const openFile = (url, fileName, fileType) => {
  // For PDFs and images, open in new tab
  if (fileType === 'pdf' || ['jpg', 'jpeg', 'png', 'gif'].includes(fileType)) {
    window.open(url, '_blank');
  } else {
    // For other files, trigger download
    const link = document.createElement('a');
    link.href = url;
    const safeName = (fileName || 'download').replace(/[^\w\-]+/g, '_');
    const ext = fileType ? `.${fileType}` : '';
    link.download = `${safeName}${ext}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}; 
