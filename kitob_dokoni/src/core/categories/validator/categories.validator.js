import Joi from "joi";

const categoriesValidator = Joi.object({
  name: Joi.string().required(),
});
export default categoriesValidator;
