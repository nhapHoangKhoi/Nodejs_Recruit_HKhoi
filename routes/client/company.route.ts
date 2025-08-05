import { Router } from "express";
import * as companyController from "../../controllers/client/company.controller";
import * as companyValidate from "../../validates/client/company.validate";

const router = Router();

router.post(
  '/register', 
  companyController.registerCompany,
  companyValidate.registerCompany
);

export default router;