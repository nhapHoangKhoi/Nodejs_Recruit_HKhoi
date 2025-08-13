import { Request, Response } from "express";
import AccountCompanyModel from "../../models/account-company.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AccountRequest } from "../../interfaces/request.interface";
import JobModel from "../../models/job.model";
import CityModel from "../../models/city.model";
import ResumeModel from "../../models/resume.model";

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
  const findObject = {
    companyId: req.account.id
  };

  // ----- Pagination ----- //
  const limitItems = 2;
  let page = 1;

  if(req.query.page) {
    const currentPage = parseInt(`${req.query.page}`);
    if(currentPage > 0) { // prevent currentPage = -1
      page = currentPage;
    }
  }

  const totalRecord = await JobModel.countDocuments(findObject);
  const totalPage = Math.ceil(totalRecord/limitItems);
  if(page > totalPage) {
    page = 1;
  }
  const skip = (page - 1) * limitItems;
  // ----- End pagination ----- //

  const jobs = await JobModel
    .find(findObject)
    .sort({
      createdAt: "desc"
    })
    .limit(limitItems)
    .skip(skip);


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
    jobs: dataFinal,
    totalPage: totalPage
  })
}

export const getEditDetailedJob = async (req: AccountRequest, res: Response) => {
  try {
    const id = req.params.id;

    const jobDetail = await JobModel.findOne({
      _id: id,
      companyId: req.account.id
    })

    if(!jobDetail) {
      res.json({
        code: "error",
        message: "ID invalid!"
      })
      return;
    }

    res.json({
      code: "success",
      message: "Get detailed job successfully!",
      jobDetail: jobDetail
    })
  } 
  catch(error) {
    console.log(error);
    res.json({
      code: "error",
      message: "ID invalid!"
    })
  }
}

export const editJob = async (req: AccountRequest, res: Response) => {
  try {
    const id = req.params.id;
    req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
    req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;
    req.body.technologies = req.body.technologies ? req.body.technologies.split(", ") : [];
    req.body.images = [];

    //--- get images
    if(req.files) {
      for (const file of req.files as any[]) {
        req.body.images.push(file.path);
      }
    }
    //--- End get images

    await JobModel.updateOne({
      _id: id,
      companyId: req.account.id
    }, req.body)

    res.json({
      code: "success",
      message: "Update job successfully!"
    })
  } 
  catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "ID invalid!"
    })
  }
}

export const deleteJobPermanent = async (req: AccountRequest, res: Response) => {
  try {
    const id = req.params.id;

    await JobModel.deleteOne({
      _id: id,
      companyId: req.account.id
    })

    res.json({
      code: "success",
      message: "Delete job successfully!"
    })
  } 
  catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "ID invalid!"
    })
  }
}

export const getListCompanies = async (req: Request, res: Response) => {
  // ----- Pagination ----- //
  let limitItems = 12;
  if(req.query.limitItems) {
    limitItems = parseInt(`${req.query.limitItems}`);
  }

  let page = 1;
  if(req.query.page) {
    const currentPage = parseInt(`${req.query.page}`);
    if(currentPage > 0) {
      page = currentPage;
    }
  }

  const totalRecord = await JobModel.countDocuments({});
  const totalPage = Math.ceil(totalRecord/limitItems);
  const skip = (page - 1) * limitItems;
  // ----- End pagination ----- //
  
  const companyList = await AccountCompanyModel
    .find({})
    .sort({
      createdAt: "desc"
    })
    .limit(limitItems)
    .skip(skip);


  const companyListFinal = [];

  for(const item of companyList) {
    const dataItemFinal = {
      id: item.id,
      logo: item.logo,
      companyName: item.companyName,
      cityName: "",
      totalJob: 0
    };

    const city = await CityModel.findOne({
      _id: item.city
    });
    dataItemFinal.cityName = `${city?.name}`;

    // total jobs
    const totalJob = await JobModel.countDocuments({
      companyId: item.id
    });
    dataItemFinal.totalJob = totalJob;

    companyListFinal.push(dataItemFinal);
  }

  res.json({
    code: "success",
    message: "Get list companies successfully!",
    companyList: companyListFinal,
    totalPage: totalPage
  })
}

export const getDetailedCompany = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const record = await AccountCompanyModel.findOne({
      _id: id
    })

    if(!record) {
      res.json({
        code: "error",
        message: "ID invalid!"
      })
      return;
    }

    const companyDetail = {
      id: record.id,
      logo: record.logo,
      companyName: record.companyName,
      address: record.address,
      companyModel: record.companyModel,
      companyEmployees: record.companyEmployees,
      workingTime: record.workingTime,
      workOvertime: record.workOvertime,
      description: record.description,
    };

    const jobs = await JobModel
      .find({
        companyId: id
      })
      .sort({
        createdAt: "desc"
      });

    const city = await CityModel.findOne({
      _id: record.city
    })

    const dataFinal = [];

    for(const item of jobs) {
      dataFinal.push({
        id: item.id,
        companyLogo: record.logo,
        title: item.title,
        companyName: record.companyName,
        salaryMin: item.salaryMin,
        salaryMax: item.salaryMax,
        level: item.level,
        workingForm: item.workingForm,
        cityName: city?.name,
        technologies: item.technologies
      });
    }

    res.json({
      code: "success",
      message: "Get detailed company successfully!",
      companyDetail: companyDetail,
      jobs: dataFinal
    })
  } 
  catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "ID invalid!"
    })
  }
}

export const getListResumes = async (req: AccountRequest, res: Response) => {
  const companyId = req.account.id;

  const listJob = await JobModel
    .find({
      companyId: companyId
    });

  const listJobId = listJob.map(item => item.id);

  const listCV = await ResumeModel
    .find({
      jobId: { $in: listJobId }
    })
    .sort({
      createdAt: "desc"
    });

  const dataFinal = [];

  for(const item of listCV) {
    const dataItemFinal = {
      id: item.id,
      jobTitle: "",
      fullName: item.fullName,
      email: item.email,
      phone: item.phone,
      jobSalaryMin: 0,
      jobSalaryMax: 0,
      jobLevel: "",
      jobWorkingForm: "",
      viewed: item.viewed,
      status: item.status,
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
    }

    dataFinal.push(dataItemFinal);
  }

  res.json({
    code: "success",
    message: "Get list resumes successfully!",
    listResumes: dataFinal
  })
}