import { Router } from "express";
import * as userController from "../../controllers/client/user.controller";
import * as userValidate from "../../validates/client/user.validate";

const router = Router();

router.post(
  '/register', 
  userValidate.registerAccount,
  userController.registerAccount
);

export default router;
