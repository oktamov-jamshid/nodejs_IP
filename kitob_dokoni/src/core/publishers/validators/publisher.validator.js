import Joi from "joi";

const publisherValidator = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
});
export default publisherValidator;
