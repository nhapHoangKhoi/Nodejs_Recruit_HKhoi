import { Request, Response } from "express";
import AccountCompanyModel from "../../models/account-company.model";
import bcrypt from "bcryptjs";

export const registerCompany = async (req: Request, res: Response) => {
  const { companyName, email, password } = req.body;

  const existedAccount = await AccountCompanyModel.findOne({
    email: email
  });

  if(existedAccount) {
    res.json({
      code: "error",
      message: "Email existed in the system!"
    });
    return;
  }

  // Encrypt password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newAccount = new AccountCompanyModel({
    companyName: companyName,
    email: email,
    password: hashedPassword
  });

  await newAccount.save();

  res.json({
    code: "success",
    message: "Register company successfully!",
  });
}