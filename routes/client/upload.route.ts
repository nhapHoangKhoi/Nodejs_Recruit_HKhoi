import { Router } from "express";
import * as uploadController from "../../controllers/client/upload.controller";

// --- Libray for uploading file, and upload to cloudinary
import multer from "multer";
import { storage } from "../../helpers/cloudinary.helper";
const upload = multer({ 
  storage: storage 
});
// --- End libray for uploading file, and upload to cloudinary

const router = Router();

router.post(
  '/image', 
  upload.single("file"),
  uploadController.uploadTinyMCEImage
);

export default router;