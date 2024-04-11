import Joi from "joi";
import { emailRegex, subscriptionList } from "../constants/user-constants.js";

export const usersSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).required(),
});

export const userEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
});

export const updateUserSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionList)
    .required(),
});
