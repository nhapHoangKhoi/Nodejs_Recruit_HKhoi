import { Router } from "express";
import * as companyController from "../../controllers/client/company.controller";
import * as companyValidate from "../../validates/client/company.validate";
import * as authMiddleware from "../../middlewares/client/auth.middleware";
// --- Libray for uploading file, and upload to cloudinary
import multer from "multer";
import { storage } from "../../helpers/cloudinary.helper";
const upload = multer({ 
  storage: storage 
});
// --- End libray for uploading file, and upload to cloudinary

const router = Router();

router.post(
  '/register', 
  companyValidate.registerCompany,
  companyController.registerCompany
);

router.post(
  '/login', 
  companyValidate.loginCompany,
  companyController.loginCompany
);

router.patch(
  '/profile', 
  authMiddleware.verifyTokenCompany,
  upload.single("logo"),
  companyController.updateProfile
);

router.post(
  '/job/create', 
  authMiddleware.verifyTokenCompany,
  upload.array("images", 8),
  companyController.createJob
);

export default router;