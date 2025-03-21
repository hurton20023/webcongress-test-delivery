import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name is required",
    "any.required": "Name is required",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email address",
      "any.required": "Email is required",
    }),
  role: Joi.string().required().messages({
    "string.empty": "Role is required",
    "any.required": "Role is required",
  }),
});
