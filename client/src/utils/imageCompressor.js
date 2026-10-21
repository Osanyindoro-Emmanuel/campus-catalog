/**
 * HTML5 Canvas Image Compressor
 * - Intercepts image file uploads
 * - Resizes to maxWidth (800px) maintaining aspect ratio
 * - Compresses to WebP at ~0.82 quality to target ~150-180KB
 * - Returns blob, dataUrl preview, and size in KB
 */
export async function compressImageToWebP(file, { maxWidth = 800, quality = 0.82 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image.'));

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas compression failed.'));
              return;
            }
            const dataUrl = canvas.toDataURL('image/webp', quality);
            const sizeKb = Math.round(blob.size / 1024);
            resolve({ blob, dataUrl, sizeKb, width, height });
          },
          'image/webp',
          quality
        );
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Uploads compressed image to Cloudinary (or falls back to permanent WebP dataUrl)
 * Never saves temporary blob: URLs which expire on session end.
 */
export async function uploadToCloudinary(blobOrDataUrl, fallbackDataUrl = null) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'campus_catalog';

  const getPermanentFallback = () => {
    if (fallbackDataUrl) return Promise.resolve(fallbackDataUrl);
    if (typeof blobOrDataUrl === 'string' && blobOrDataUrl.startsWith('data:')) {
      return Promise.resolve(blobOrDataUrl);
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to convert image to permanent data URL'));
      reader.readAsDataURL(blobOrDataUrl);
    });
  };

  if (!cloudName) {
    // Graceful offline/local fallback: ALWAYS return a permanent Base64 data URL
    return getPermanentFallback();
  }

  try {
    const formData = new FormData();
    formData.append('file', blobOrDataUrl);
    formData.append('upload_preset', uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Cloudinary upload returned status ${res.status}`);
    }

    const data = await res.json();
    return data.secure_url || data.url;
  } catch (err) {
    console.warn('Cloudinary upload unavailable, falling back to permanent WebP data URL:', err);
    return getPermanentFallback();
  }
}
