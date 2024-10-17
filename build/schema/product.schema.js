"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const categories_1 = require("@/src/utils/constants/categories");
const productCreateSchema = joi_1.default.object({
    name: joi_1.default.string().required().min(3).max(100).messages({
        "string.base": "Product name must be a string",
        "string.empty": "Product name is required",
        "string.min": "Product name must be at least 3 characters long",
        "string.max": "Product name must be less than 100 characters long",
    }),
    category: joi_1.default.string()
        .required()
        .valid(...categories_1.product_categoies)
        .messages({
        "string.base": "Category must be a string",
        "any.required": "Category is required",
        "any.only": "Invalid category",
    }),
    price: joi_1.default.number().required().positive().greater(0.01).messages({
        "number.base": "Price must be a number",
        "any.required": "Price is required",
        "number.positive": "Price must be a positive number",
        "number.greater": "Price must be greater than 0.01",
    }),
});
exports.default = productCreateSchema;
//# sourceMappingURL=product.schema.js.map