import { Request, Response } from "express";
import CityModel from "../../models/city.model";

export const getCities = async (req: Request, res: Response) => {
  const cityList = await CityModel.find({});
  
  res.json({
    code: "success",
    message: "Get list cities successfully!",
    cityList: cityList
  });
}