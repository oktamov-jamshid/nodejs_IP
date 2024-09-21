import Joi from "joi";

const ordersValidator = Joi.object({
  quantity: Joi.number().required(),
  total_price: Joi.number().required(),
  user_id: Joi.number().required(),
  book_id: Joi.number().required().valid(),
});
export default ordersValidator;
