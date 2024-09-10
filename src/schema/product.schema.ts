import Joi from "joi";

const productCreateSchema = Joi.object({
  name: Joi.string().required().min(3).max(100).messages({
    "string.base": "Product name must be a string",
    "string.empty": "Product name is required",
    "string.min": "Product name must be at least 3 characters long",
    "string.max": "Product name must be less than 100 characters long",
  }),

  category: Joi.string()
    .required()
    .valid("electronics", "fashion", "beauty", "books", "sports")
    .messages({
      "string.base": "Category must be a string",
      "any.required": "Category is required",
      "any.only": "Invalid category",
    }),

  price: Joi.number().required().positive().greater(0.01).messages({
    "number.base": "Price must be a number",
    "any.required": "Price is required",
    "number.positive": "Price must be a positive number",
    "number.greater": "Price must be greater than 0.01",
  }),
});

export default productCreateSchema;
