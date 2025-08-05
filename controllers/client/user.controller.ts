import { Request, Response } from 'express';
import AccountUserModel from "../../models/account-user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

export const loginAccount = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check existed email
  const existedAccount = await AccountUserModel.findOne({
    email: email
  });

  if(!existedAccount) {
    res.json({
      code: "error",
      message: "Email not existed in the system!"
    });
    return;
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, `${existedAccount.password}`);

  if (!isPasswordValid) {
    res.json({
      code: "error",
      message: "Password is incorrect!"
    });
    return;
  }

  // Stay logged in using JWT
  const token = jwt.sign(
    {
      id: existedAccount.id,
      email: existedAccount.email,
    },
    `${process.env.JWT_SECRET}`,
    { 
      expiresIn: '1d' // token is valid for 1 day
    }
  );

  // Store token into cookie
  res.cookie(
    "tokenAccount", 
    token, 
    {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true, // only Server is allowed to access this cookie
      sameSite: "lax", // allow sending cookies between other different domain names (FE, BE)
      secure: process.env.NODE_ENV === "production" // true: website https, false: website not https
    }
  );

  res.json({
    code: "success",
    message: "Login successfully!",
  });
}