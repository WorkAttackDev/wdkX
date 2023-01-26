import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

export type MulterCloudinaryFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  path: string;
  size: number;
  filename: string;
};

type Params = {
  cloud_name: string;
  api_key: string;
  api_secret: string;
  folder: string;
};

export const makeMulterCloudinaryStorage = ({
  cloud_name,
  api_key,
  api_secret,
  folder,
}: Params) => {
  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
  });

  const destroyFile = (publicId: string): Promise<any> => {
    return new Promise((resolve: any, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        error ? reject(error) : resolve(result);
      });
    });
  };

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      //@ts-ignore
      folder,
    },
  });

  return { multer: multer({ storage: storage }), destroyFile };
};
