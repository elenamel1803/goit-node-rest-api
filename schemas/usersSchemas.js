import Joi from "joi";
import { emailRegex, subscriptionList } from "../constants/user-constants.js";

export const usersSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required().messages({
    "string.base": "Email must be a string",
    "string.pattern.base": "Incorrect email format",
    "any.required": "Missing required field email",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Password must be a string",
    "string.min": "Password must have a minimum length of 6",
    "any.required": "Missing required field password",
  }),
});

export const userEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required().messages({
    "string.base": "Email must be a string",
    "string.pattern.base": "Incorrect email format",
    "any.required": "Missing required field email",
  }),
});

export const updateUserSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionList)
    .required()
    .messages({
      "string.base": "Subscription must be a string",
      "string.valid": "Invalid subscription value",
      "any.required": "Missing required field subscription",
    }),
});
