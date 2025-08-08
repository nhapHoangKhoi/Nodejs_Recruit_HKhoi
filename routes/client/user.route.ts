import { Router } from "express";
import * as userController from "../../controllers/client/user.controller";
import * as userValidate from "../../validates/client/user.validate";
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
  userValidate.registerAccount,
  userController.registerAccount
);

router.post(
  '/login', 
  userValidate.loginAccount,
  userController.loginAccount
);

router.patch(
  '/profile', 
  authMiddleware.verifyTokenUser,
  upload.single("avatar"),
  userController.updateProfile
);


export default router;
