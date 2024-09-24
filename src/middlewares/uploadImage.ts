import { S3Client } from "@aws-sdk/client-s3";
import multer, { FileFilterCallback } from "multer";
import multerS3 from "multer-s3";
import { Request } from "express"; // Assuming you're using Express

// Configure the S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION as string, // TypeScript ensures process.env values are strings
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

// Multer configuration for file uploads to S3
export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME as string,
    metadata: (
      _req: Request,
      file: Express.Multer.File,
      cb: (error: any, metadata?: any) => void
    ) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (
      _req: Request,
      file: Express.Multer.File,
      cb: (error: any, key?: string) => void
    ) => {
      const fileName = `uploads/${Date.now().toString()}_${file.originalname}`;
      cb(null, fileName);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    // Accept images only
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed.") as any, false);
    }
    cb(null, true);
  },
});
