import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const registerAccount = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
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
    password: Joi.string()
      .required()
      .min(8) // at least 8 characters
      .custom((value, helpers) => {
        if (!/[A-Z]/.test(value)) {
          return helpers.error("password.uppercase"); // at least 1 uppercase letter
        }
        if (!/[a-z]/.test(value)) {
          return helpers.error("password.lowercase"); // at least 1 lowercase letter
        }
        if (!/\d/.test(value)) {
          return helpers.error("password.number"); // at least 1 digit
        }
        if (!/[@$!%*?&]/.test(value)) {
          return helpers.error("password.special"); // at least 1 special character
        }
        return value; // if all conditions are met
      })
      .messages({
        "string.empty": "Please enter password!",
        "string.min": "Password must contain at least 8 characters!",
        "password.uppercase": "Password must contain at least 1 uppercase letter!",
        "password.lowercase": "Password must contain at least 1 lowercase letter!",
        "password.number": "Password must contain at least 1 digit!",
        "password.special": "Password must contain at least 1 special character!",
      }),
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