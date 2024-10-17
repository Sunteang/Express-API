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
exports.ProductService = void 0;
const product_repository_1 = __importDefault(require("@/src/database/repositories/product.repository"));
class ProductService {
    getAllProducts(queries) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit, filter, sort } = queries;
                const newQueries = {
                    page,
                    limit,
                    filter: filter && JSON.parse(filter),
                    sort: sort && JSON.parse(sort),
                };
                const result = yield product_repository_1.default.getAllProducts(newQueries); //getAll to getAllProduct
                return result;
            }
            catch (error) {
                console.error(`ProductService - getAllProducts() method error: ${error}`);
                throw error;
            }
        });
    }
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield product_repository_1.default.getProductById(id);
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
                const newProduct = yield product_repository_1.default.createProduct(productRequest);
                return newProduct;
            }
            catch (error) {
                console.log(`ProductService - createProduct() method error: ${error}`);
                throw error;
            }
        });
    }
    updateProduct(id, productRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedProduct = yield product_repository_1.default.updateProduct(id, productRequest);
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
                yield product_repository_1.default.deleteProduct(id);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.ProductService = ProductService;
exports.default = new ProductService();
//# sourceMappingURL=product.service.js.map