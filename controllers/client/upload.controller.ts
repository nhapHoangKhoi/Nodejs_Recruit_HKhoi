import { Request, Response } from "express";

export const uploadTinyMCEImage = async (req: Request, res: Response) => {
  res.json({
    location: req?.file?.path
  });
}