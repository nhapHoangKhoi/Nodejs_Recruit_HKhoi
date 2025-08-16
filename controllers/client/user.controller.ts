import { Request, Response } from 'express';
import AccountUserModel from "../../models/account-user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AccountRequest } from '../../interfaces/request.interface';
import ResumeModel from '../../models/resume.model';
import JobModel from '../../models/job.model';
import AccountCompanyModel from '../../models/account-company.model';

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

export const updateProfile = async (req: AccountRequest, res: Response) => {
  if(req.file) {
    req.body.avatar = req.file.path;
  } 
  else {
    delete req.body.avatar;
  }

  await AccountUserModel.updateOne({
    _id: req.account.id
  }, req.body);
  
  res.json({
    code: "success",
    message: "Update profile successfully!"
  });
}

export const getListSentResumes = async (req: AccountRequest, res: Response) => {
  const userEmail = req.account.email;
  
  const listCV = await ResumeModel
    .find({
      email: userEmail
    })
    .sort({
      createdAt: "desc"
    });

  const dataFinal = [];

  for(const item of listCV) {
    const dataItemFinal = {
      id: item.id,
      jobTitle: "",
      companyName: "",
      jobSalaryMin: 0,
      jobSalaryMax: 0,
      jobLevel: "",
      jobWorkingForm: "",
      status: item.status
    };

    const infoJob = await JobModel.findOne({
      _id: item.jobId
    })

    if(infoJob) {
      dataItemFinal.jobTitle = `${infoJob.title}`;
      dataItemFinal.jobSalaryMin = parseInt(`${infoJob.salaryMin}`);
      dataItemFinal.jobSalaryMax = parseInt(`${infoJob.salaryMax}`);
      dataItemFinal.jobLevel = `${infoJob.level}`;
      dataItemFinal.jobWorkingForm = `${infoJob.workingForm}`;

      const infoCompany = await AccountCompanyModel.findOne({
        _id: infoJob.companyId
      })

      if(infoCompany) {
        dataItemFinal.companyName = `${infoCompany.companyName}`;
      }
    }

    dataFinal.push(dataItemFinal);
  }

  res.json({
    code: "success",
    message: "Get list sent resumes successfully!",
    listCV: dataFinal
  });
}