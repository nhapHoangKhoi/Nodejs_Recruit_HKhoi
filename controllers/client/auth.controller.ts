import { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import AccountUserModel from '../../models/account-user.model';
import AccountCompanyModel from '../../models/account-company.model';

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.tokenAccount || req.cookies.tokenCompany;
    
    if(!token) {
      res.json({
        code: "error",
        message: "Token not sent!"
      });

      return;
    }

    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as jwt.JwtPayload;
    const { id, email } = decoded;

    // Check existed user
    const existedAccountUser = await AccountUserModel.findOne({
      _id: id,
      email: email
    });

    if(existedAccountUser) {
      const infoUser = {
        id: existedAccountUser.id,
        fullName: existedAccountUser.fullName,
        email: existedAccountUser.email
      };

      res.json({
        code: "success",
        message: "Token valid!",
        infoUser: infoUser
      })
      return;
    }

    // Check existed company
    const existedAccountCompany = await AccountCompanyModel.findOne({
      _id: id,
      email: email
    });

    if(existedAccountCompany) {
      const infoCompany = {
        id: existedAccountCompany.id,
        companyName: existedAccountCompany.companyName,
        email: existedAccountCompany.email
      };

      res.json({
        code: "success",
        message: "Token valid!",
        infoCompany: infoCompany
      })
      return;
    }

    if(!existedAccountUser && !existedAccountCompany) {
      res.clearCookie("tokenAccount");
      res.clearCookie("tokenCompany");

      res.json({
        code: "error",
        message: "Invalid token!"
      })
      return;
    }

  } 
  catch (error) {
    res.clearCookie("tokenAccount");
    res.clearCookie("tokenCompany");

    res.json({
      code: "error",
      message: "Invalid token!"
    })
    return;
  }
}

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("tokenAccount");
  res.clearCookie("tokenCompany");

  res.json({
    code: "success",
    message: "Logout successfully!"
  })
}