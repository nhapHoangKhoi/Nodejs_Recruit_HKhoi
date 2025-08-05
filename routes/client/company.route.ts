import { Router } from "express";
import * as companyController from "../../controllers/client/company.controller";
import * as companyValidate from "../../validates/client/company.validate";

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

export default router;