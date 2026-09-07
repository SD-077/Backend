import { type RequestHandler } from 'express';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const cloudUploader: RequestHandler = async (req, res, next) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.image[0].filepath, {
      folder: 'images'
    });

    req.file = { url: result.url, publicId: result.public_id };

    next();
  } catch (error) {
    next(error);
  }
};

export default cloudUploader;
