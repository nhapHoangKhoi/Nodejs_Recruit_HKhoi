import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import AccountUserModel from "../../models/account-user.model";
import AccountCompanyModel from "../../models/account-company.model";
import { AccountRequest } from "../../interfaces/request.interface";

export const verifyTokenUser = async (req: AccountRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.tokenAccount;
    
    if(!token) {
      res.json({
        code: "error",
        message: "Not sent token!"
      });
      return;
    }

    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as jwt.JwtPayload;
    const { id, email } = decoded;

    const existedAccount = await AccountUserModel.findOne({
      _id: id,
      email: email
    });

    if(!existedAccount) {
      res.clearCookie("tokenAccount");

      res.json({
        code: "error",
        message: "Invalid token!"
      });
      return;
    }

    req.account = existedAccount;

    next();
  } 
  catch (error) {
    res.clearCookie("tokenAccount");

    res.json({
      code: "error",
      message: "Invalid token!"
    });
  }
}

export const verifyTokenCompany = async (req: AccountRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.tokenCompany;
    
    if (!token) {
      res.json({
        code: "error",
        message: "Not sent token!"
      });
      return;
    }

    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as jwt.JwtPayload;
    const { id, email } = decoded;

    const existedAccount = await AccountCompanyModel.findOne({
      _id: id,
      email: email
    });

    if(!existedAccount) {
      res.clearCookie("tokenCompany");
      
      res.json({
        code: "error",
        message: "Invalid token!"
      });
      return;
    }

    req.account = existedAccount;

    next();
  } 
  catch (error) {
    res.clearCookie("tokenCompany");

    res.json({
      code: "error",
      message: "Invalid token!"
    })
  }
}