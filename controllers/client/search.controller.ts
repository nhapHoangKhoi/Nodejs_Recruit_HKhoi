import { Request, Response } from "express";
import JobModel from "../../models/job.model";
import AccountCompanyModel from "../../models/account-company.model";
import CityModel from "../../models/city.model";

export const search = async (req: Request, res: Response) => {
  const dataFinal = [];

  // convert to array
  if(Object.keys(req.query).length > 0) {
    const findObject: any = {};

    // --- filter by box technologies
    if(req.query.language) {
      findObject.technologies = req.query.language;
    }
    // --- End filter by box technologies

    // --- filter by box locations
    if(req.query.city) {
      const city = await CityModel.findOne({
        name: req.query.city
      })

      if(city) {
        const listAccountCompanyInCity = await AccountCompanyModel.find({
          city: city.id
        })
        const listIdAccountCompany = listAccountCompanyInCity.map(item => item.id);
        
        findObject.companyId = { $in: listIdAccountCompany };
        // const findObject: any = {
        //   companyId: { $in: [32, 234, 4353] }
        // };
      }
    }
    // --- End filter by box locations

    // --- filter by box companies
    if(req.query.company) {
      const accountCompany = await AccountCompanyModel.findOne({
        companyName: { $regex: req.query.company, $options: 'i' } // i for case-insensitive
      })
      findObject.companyId = accountCompany?.id; // used for when there is no matched result
    }
    // --- End filter by box companies

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