import { Router } from "express";
import * as jobController from "../../controllers/client/job.controller";

const router = Router();

router.get('/detail/:id', jobController.getDetailedJob);

export default router;