"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
// Configure the S3 client
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION, // TypeScript ensures process.env values are strings
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
// Multer configuration for file uploads to S3
exports.upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        metadata: (_req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (_req, file, cb) => {
            const fileName = `uploads/${Date.now().toString()}_${file.originalname}`;
            cb(null, fileName);
        },
    }),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter: (_req, file, cb) => {
        // Accept images only
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed."), false);
        }
        cb(null, true);
    },
});
//# sourceMappingURL=uploadImage.js.map