import { Request, Response } from "express";
import JobModel from "../../models/job.model";
import AccountCompanyModel from "../../models/account-company.model";
import ResumeModel from "../../models/resume.model";

export const getDetailedJob = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const record = await JobModel.findOne({
      _id: id
    })

    if(!record) {
      res.json({
        code: "error",
        message: "ID invalid!"
      });
      return;
    }

    const jobDetail = {
      id: record.id,
      title: record.title,
      companyName: "",
      salaryMin: record.salaryMin,
      salaryMax: record.salaryMax,
      images: record.images,
      level: record.level,
      workingForm: record.workingForm,
      companyAddress: "",
      technologies: record.technologies,
      description: record.description,
      companyLogo: "",
      companyId: record.companyId,
      companyModel: "",
      companyEmployees: "",
      companyWorkingTime: "",
      companyWorkOvertime: ""
    };

    const infoCompany = await AccountCompanyModel.findOne({
      _id: record.companyId
    })

    if(infoCompany) {
      jobDetail.companyName = `${infoCompany.companyName}`;
      jobDetail.companyAddress = `${infoCompany.address}`;
      jobDetail.companyLogo = `${infoCompany.logo}`;
      jobDetail.companyModel = `${infoCompany.companyModel}`;
      jobDetail.companyEmployees = `${infoCompany.companyEmployees}`;
      jobDetail.companyWorkingTime = `${infoCompany.workingTime}`;
      jobDetail.companyWorkOvertime = `${infoCompany.workOvertime}`;
    }

    res.json({
      code: "success",
      message: "Get detailed job successfully!",
      jobDetail: jobDetail
    })
  } 
  catch (error) {
    res.json({
      code: "error",
      message: "ID invalid!"
    })
  }
}

export const applyJob = async (req: Request, res: Response) => {
  //--- validate when there is not file
  if(!req.file) {
    res.json({
      code: "error",
      message: "Please sent with your resume!"
    });
    return;
  }
  req.body.fileCV = req.file.path;
  //--- End validate when there is not file
  
  const newRecord = new ResumeModel(req.body);
  await newRecord.save();

  res.json({
    code: "success",
    message: "Apply job successfully!"
  })
}