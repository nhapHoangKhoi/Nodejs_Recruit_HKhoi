import { Request, Response } from "express";
import JobModel from "../../models/job.model";
import AccountCompanyModel from "../../models/account-company.model";
import CityModel from "../../models/city.model";

export const search = async (req: Request, res: Response) => {
  const dataFinal = [];

  // convert to array
  if(Object.keys(req.query).length > 0) {
    const findObject: any = {};

    if(req.query.language) {
      findObject.technologies = req.query.language;
    }

    const jobs = await JobModel
      .find(findObject)
      .sort({
        createdAt: "desc"
      })

    for(const item of jobs) {
      const itemFinal = {
        id: item.id,
        companyLogo: "",
        title: item.title,
        companyName: "",
        salaryMin: item.salaryMin,
        salaryMax: item.salaryMax,
        level: item.level,
        workingForm: item.workingForm,
        cityName: "",
        technologies: item.technologies
      };

      // Info company
      const infoCompany = await AccountCompanyModel.findOne({
        _id: item.companyId
      })

      if(infoCompany) {
        itemFinal.companyLogo = `${infoCompany.logo}`;
        itemFinal.companyName = `${infoCompany.companyName}`;

        const city = await CityModel.findOne({
          _id: infoCompany.city
        })
        itemFinal.cityName = `${city?.name}`;
      }

      dataFinal.push(itemFinal);
    }
  }

  res.json({
    code: "success",
    message: "Search successfully!",
    jobs: dataFinal
  });
}