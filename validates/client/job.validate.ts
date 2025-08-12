import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const applyJob = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    jobId: Joi.string()
      .required()
      .messages({
        "string.empty": "Not found this job!"
      }),
    fullName: Joi.string()
      .required()
      .min(5)
      .max(50)
      .messages({
        "string.empty": "Full name is required!",
        "string.min": "Full name must be at least 5 characters!",
        "string.max": "Full name must not exceed 50 characters!"
      }),
    email: Joi.string()
      .required()
      .email()
      .messages({
        "string.empty": "Email is required!",
        "string.email": "Email format is invalid!"
      }),
    phone: Joi.string()
      .required()
      .custom((value, helpers) => {
        if(!/(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(value)) {
          return helpers.error("phone.invalid"); // format vietnamese
        }
        return value;
      })
      .messages({
        "string.empty": "Phone number is required!",
        "phone.invalid": "Phone number format is invaild in Vietnam!"
      }),
    fileCV: Joi.string().allow('')
  });

  const { error } = schema.validate(req.body);

  if(error) {
    const errorMessage = error.details[0].message;

    res.json({
      code: "error",
      message: errorMessage
    });
    return;
  }

  next();
}