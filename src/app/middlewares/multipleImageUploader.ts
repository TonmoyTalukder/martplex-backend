import { Request, Response, NextFunction } from 'express';
import { ICloudinaryResponse } from '../interfaces/file';
import { fileUploader } from '../../helpers/fileUploader';


export const multipleImageUploader = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    const uploadedImages: ICloudinaryResponse[] = await fileUploader.uploadMultipleToCloudinary(
      files,
    );

    // Add uploaded image URLs to the request body
    req.body.images = uploadedImages.map((img) => img.secure_url);
    next();
  } catch (error) {
    next(error); // Pass error to the error-handling middleware
  }
};
