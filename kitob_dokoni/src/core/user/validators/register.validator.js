import Joi from "joi";

const registerValidator = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().required().valid("Admin", "User", "Seller"),
});
export default registerValidator;
