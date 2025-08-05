import { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import AccountUserModel from '../../models/account-user.model';

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.tokenAccount;
    
    if(!token) {
      res.json({
        code: "error",
        message: "Token not sent!"
      });

      return;
    }

    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as jwt.JwtPayload;
    const { id, email } = decoded;

    const isAccountExist = await AccountUserModel.findOne({
      _id: id,
      email: email
    });

    if(!isAccountExist) {
      res.clearCookie("token");
      res.json({
        code: "error",
        message: "Invalid token!"
      })
      return;
    }

    const infoUser = {
      id: isAccountExist.id,
      fullName: isAccountExist.fullName,
      email: isAccountExist.email
    };

    res.json({
      code: "success",
      message: "Token valid!",
      infoUser: infoUser
    })
  } 
  catch (error) {
    res.clearCookie("token");
    res.json({
      code: "error",
      message: "Invalid token!"
    })
    return;
  }
}