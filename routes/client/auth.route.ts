import { Router } from "express";
import * as authController from "../../controllers/client/auth.controller";

const router = Router();

router.get('/check', authController.verifyToken);
router.get('/logout', authController.logout);

export default router;