import { Router } from "express";
import * as cityController from "../../controllers/client/city.controller";

const router = Router();

router.get('/list', cityController.getCities);

export default router;