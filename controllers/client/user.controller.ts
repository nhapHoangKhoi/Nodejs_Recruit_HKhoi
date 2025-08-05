import { Request, Response } from 'express';
import AccountUserModel from "../../models/account-user.model";
import bcrypt from "bcryptjs";

export const registerAccount = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  const existedAccount = await AccountUserModel.findOne({
    email: email
  });

  if(existedAccount) {
    res.json({
      code: "error",
      message: "Email existed in the system!"
    });
    return;
  }

  // Encyrpt password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newAccount = new AccountUserModel({
    fullName: fullName,
    email: email,
    password: hashedPassword
  });

  await newAccount.save();

  res.json({
    code: "success",
    message: "Sign up successfully!"
  })
}