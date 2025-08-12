import { Router } from "express";
import * as jobController from "../../controllers/client/job.controller";
import * as jobValidate from "../../validates/client/job.validate";

// --- Libray for uploading file, and upload to cloudinary
import multer from "multer";
import { storage } from "../../helpers/cloudinary.helper";
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if(file.mimetype !== 'application/pdf') {
      cb(null, false);
      return;
    }
    cb(null, true);
  }
});
// --- End libray for uploading file, and upload to cloudinary

const router = Router();

router.get('/detail/:id', jobController.getDetailedJob);

router.post(
  '/apply', 
  upload.single("fileCV"),
  jobValidate.applyJob,
  jobController.applyJob
);

export default router;