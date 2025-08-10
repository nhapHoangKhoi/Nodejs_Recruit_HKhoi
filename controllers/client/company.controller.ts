import { Request, Response } from "express";
import AccountCompanyModel from "../../models/account-company.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AccountRequest } from "../../interfaces/request.interface";
import JobModel from "../../models/job.model";
import CityModel from "../../models/city.model";

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

export const loginCompany = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check existed emaile
  const existedAccount = await AccountCompanyModel.findOne({
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
    "tokenCompany", 
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
    req.body.logo = req.file.path;
  } 
  else {
    delete req.body.logo;
  }

  await AccountCompanyModel.updateOne({
    _id: req.account.id
  }, req.body);
  
  res.json({
    code: "success",
    message: "Update profile successfully!"
  });
}

export const createJob = async (req: AccountRequest, res: Response) => {
  req.body.companyId = req.account.id;
  req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
  req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;
  req.body.technologies = req.body.technologies ? req.body.technologies.split(", ") : [];
  req.body.images = [];

  //--- get images
  if(req.files) {
    for(const file of req.files as any[]) {
      req.body.images.push(file.path);
    }
  }
  //--- End get images

  const newRecord = new JobModel(req.body);
  await newRecord.save();
  
  res.json({
    code: "success",
    message: "Create new job successfully!"
  })
}

export const getListJobs = async (req: AccountRequest, res: Response) => {
  const jobs = await JobModel.find({
    companyId: req.account.id
  })

  const city = await CityModel.findOne({
    _id: req.account.city
  })

  const dataFinal = [];

  for(const item of jobs) {
    dataFinal.push({
      id: item.id,
      companyLogo: req.account.logo,
      title: item.title,
      companyName: req.account.companyName,
      salaryMin: item.salaryMin,
      salaryMax: item.salaryMax,
      level: item.level,
      workingForm: item.workingForm,
      companyCity: city?.name,
      technologies: item.technologies
    });
  }

  res.json({
    code: "success",
    message: "Get jobs list successfully!",
    jobs: dataFinal
  })
}