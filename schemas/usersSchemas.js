import Joi from "joi";
import { emailRegex } from "../constants/user-constants.js";

export const userSignupSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRegex).required(),
  //   subscription: Joi.string(),
  //   token: Joi.string(),
});

// export const userSigninSchema = Joi.object({
//   password: Joi.string().min(6).required(),
//   email: Joi.string().pattern(emailRegex).required(),
//   //   subscription: Joi.string(),
//   //   token: Joi.string(),
// });
