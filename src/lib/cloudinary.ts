import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(
  file: Buffer | string,
  folder: string = 'shopsprinters'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Upload failed: ${error.message}`));
        } else {
          resolve(result?.secure_url || '');
        }
      }
    );

    if (Buffer.isBuffer(file)) {
      stream.end(file);
    } else {
      stream.end(file);
    }
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
}

export function getPublicIdFromUrl(url: string): string {
  const matches = url.match(/\/([^/]+)$/);
  return matches ? matches[1].split('.')[0] : '';
}
