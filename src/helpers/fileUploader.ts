import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { ICloudinaryResponse, IFile } from '../app/interfaces/file';
import config from '../app/config';

cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_cloud_name,
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_secret,
});

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(process.cwd(), 'uploads'));
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (
  file: IFile,
): Promise<ICloudinaryResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      (error: Error, result: ICloudinaryResponse) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );
  });
};

const uploadMultipleToCloudinary = async (
  files: IFile[],
): Promise<ICloudinaryResponse[]> => {
  const uploadPromises = files.map((file) => uploadToCloudinary(file));
  const results = await Promise.all(uploadPromises);
  return results.filter(
    (result): result is ICloudinaryResponse => result !== undefined,
  );
};

const multipleImageUploader = {
  upload: upload.array('images', 10), // Allow up to 10 images per request
  uploadToCloudinary,
  uploadMultipleToCloudinary,
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
  multipleImageUploader,
  uploadMultipleToCloudinary,
};
