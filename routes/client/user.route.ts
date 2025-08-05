import { Router } from "express";
import * as userController from "../../controllers/client/user.controller";
import * as userValidate from "../../validates/client/user.validate";

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

export default router;
