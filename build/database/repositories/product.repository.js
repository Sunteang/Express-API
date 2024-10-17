"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_model_1 = __importDefault(require("@/src/database/models/product.model"));
const errors_1 = require("@/src/utils/errors");
class ProductRepository {
    getAllProducts(queries) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10, filter = {}, sort = { name: "asc" }, } = queries;
            const sortFields = Object.keys(sort).reduce((acc, key) => {
                const direction = sort[key];
                acc[key] = direction === "asc" ? 1 : -1;
                return acc;
            }, {});
            const buildFilter = (filter) => {
                const mongoFilter = {};
                for (const key in filter) {
                    if (typeof filter[key] === "object" && filter[key] !== null) {
                        if (filter[key].min || filter[key].max) {
                            mongoFilter[key] = {};
                            if (filter[key].min !== undefined) {
                                mongoFilter[key].$gte = filter[key].min;
                            }
                            if (filter[key].max !== undefined) {
                                mongoFilter[key].$lte = filter[key].max;
                            }
                        }
                        else {
                            mongoFilter[key] = filter[key];
                        }
                    }
                    else {
                        mongoFilter[key] = filter[key];
                    }
                }
                return mongoFilter;
            };
            try {
                const mongoFilter = buildFilter(filter);
                const products = yield product_model_1.default.find(mongoFilter)
                    .sort(sortFields)
                    .skip((page - 1) * limit)
                    .limit(limit);
                const totalItems = yield product_model_1.default.countDocuments(mongoFilter);
                return {
                    totalItems,
                    totalPages: Math.ceil(totalItems / limit),
                    currentPage: page,
                    products,
                };
            }
            catch (error) {
                console.error(`ProductRepository - getAllProducts() method error: ${error}`);
                throw error;
            }
        });
    }
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield product_model_1.default.findById(id);
                if (!product) {
                    throw new errors_1.NotFoundError("Product not found!");
                }
                return product;
            }
            catch (error) {
                throw error;
            }
        });
    }
    createProduct(productRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newProduct = yield product_model_1.default.create(productRequest);
                return newProduct;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateProduct(id, productRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedProduct = yield product_model_1.default.findByIdAndUpdate(id, productRequest, { new: true });
                if (!updatedProduct) {
                    throw new errors_1.NotFoundError("Product not found!");
                }
                return updatedProduct;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteProduct = yield product_model_1.default.findByIdAndDelete(id);
                if (!deleteProduct) {
                    throw new errors_1.NotFoundError("Product not found!");
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = new ProductRepository();
//# sourceMappingURL=product.repository.js.map