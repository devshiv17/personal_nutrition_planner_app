// Image optimization utilities for profile pictures

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'webp' | 'png';
  maintainAspectRatio?: boolean;
}

export interface OptimizedImage {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  size: number;
  format: string;
}

export const DEFAULT_PROFILE_OPTIONS: ImageOptimizationOptions = {
  maxWidth: 400,
  maxHeight: 400,
  quality: 0.8,
  format: 'jpeg',
  maintainAspectRatio: true
};

/**
 * Optimizes an image file for profile picture use
 */
export const optimizeImage = async (
  file: File,
  options: ImageOptimizationOptions = DEFAULT_PROFILE_OPTIONS
): Promise<OptimizedImage> => {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('File must be an image'));
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      reject(new Error('File size must be less than 10MB'));
      return;
    }

    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not create canvas context'));
      return;
    }

    img.onload = () => {
      try {
        const {
          maxWidth = 400,
          maxHeight = 400,
          quality = 0.8,
          format = 'jpeg',
          maintainAspectRatio = true
        } = options;

        let { width, height } = img;

        // Calculate new dimensions
        if (maintainAspectRatio) {
          const aspectRatio = width / height;
          
          if (width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
          }
          
          if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
          }
        } else {
          width = Math.min(width, maxWidth);
          height = Math.min(height, maxHeight);
        }

        // Set canvas size
        canvas.width = width;
        canvas.height = height;

        // Draw and compress image
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        const mimeType = format === 'png' ? 'image/png' : 
                        format === 'webp' ? 'image/webp' : 'image/jpeg';
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create optimized image'));
              return;
            }

            const dataUrl = canvas.toDataURL(mimeType, quality);
            
            resolve({
              blob,
              dataUrl,
              width,
              height,
              size: blob.size,
              format: format
            });
          },
          mimeType,
          quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Load image
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Generates multiple sizes of an image for responsive use
 */
export const generateImageSizes = async (
  file: File,
  sizes: Array<{ name: string; width: number; height: number }>
): Promise<Record<string, OptimizedImage>> => {
  const results: Record<string, OptimizedImage> = {};

  for (const size of sizes) {
    try {
      const optimized = await optimizeImage(file, {
        maxWidth: size.width,
        maxHeight: size.height,
        quality: 0.8,
        format: 'jpeg'
      });
      results[size.name] = optimized;
    } catch (error) {
      console.error(`Failed to generate size ${size.name}:`, error);
    }
  }

  return results;
};

/**
 * Validates image file before processing
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check if it's an image
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }

  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  // Check supported formats
  const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!supportedFormats.includes(file.type.toLowerCase())) {
    return { valid: false, error: 'Supported formats: JPEG, PNG, WebP' };
  }

  return { valid: true };
};

/**
 * Creates a circular crop of an image
 */
export const createCircularCrop = async (
  file: File,
  size: number = 200
): Promise<OptimizedImage> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not create canvas context'));
      return;
    }

    img.onload = () => {
      try {
        canvas.width = size;
        canvas.height = size;

        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size / 2;

        // Create circular clip
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.clip();

        // Calculate crop dimensions
        const minDimension = Math.min(img.width, img.height);
        const cropX = (img.width - minDimension) / 2;
        const cropY = (img.height - minDimension) / 2;

        // Draw image
        ctx.drawImage(
          img,
          cropX, cropY, minDimension, minDimension,
          0, 0, size, size
        );

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create circular crop'));
              return;
            }

            const dataUrl = canvas.toDataURL('image/png');
            
            resolve({
              blob,
              dataUrl,
              width: size,
              height: size,
              size: blob.size,
              format: 'png'
            });
          },
          'image/png'
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Formats file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * Converts blob to base64
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read blob'));
    reader.readAsDataURL(blob);
  });
};

/**
 * Profile picture size presets
 */
export const PROFILE_PICTURE_SIZES = {
  thumbnail: { width: 50, height: 50 },
  small: { width: 100, height: 100 },
  medium: { width: 200, height: 200 },
  large: { width: 400, height: 400 }
};

const imageOptimizationUtils = {
  optimizeImage,
  generateImageSizes,
  validateImageFile,
  createCircularCrop,
  formatFileSize,
  blobToBase64,
  PROFILE_PICTURE_SIZES,
  DEFAULT_PROFILE_OPTIONS
};

export default imageOptimizationUtils;