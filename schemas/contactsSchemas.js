import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name must be a string",
    "any.required": "Missing required field name",
  }),
  email: Joi.string().required().messages({
    "string.base": "Email must be a string",
    "any.required": "Missing required field email",
  }),
  phone: Joi.string().required().messages({
    "string.base": "Phone must be a string",
    "any.required": "Missing required field phone",
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().messages({
    "string.base": "Name must be a string",
  }),
  email: Joi.string().messages({
    "string.base": "Email must be a string",
  }),
  phone: Joi.string().messages({
    "string.base": "Phone must be a string",
  }),
});

export const updateStatusContactSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "boolean.base": "Favorite must be true or false",
    "any.required": "Missing required field favorite",
  }),
});
