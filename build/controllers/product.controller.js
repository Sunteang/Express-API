"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const tsoa_1 = require("tsoa");
const product_request_type_1 = require("@/src/controllers/types/product-request.type");
const product_service_1 = __importDefault(require("@/src/services/product.service"));
const product_schema_1 = __importDefault(require("@/src/schema/product.schema"));
const validate_input_1 = __importDefault(require("@/src/middlewares/validate-input"));
let ProductController = class ProductController extends tsoa_1.Controller {
    getAllProducts(queries) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield product_service_1.default.getAllProducts(queries);
                return {
                    message: "Success",
                    data: response,
                };
            }
            catch (error) {
                console.error(`ProductController - getAllProducts() method error: ${error}`);
                throw error;
            }
        });
    }
    createItem(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newProduct = yield product_service_1.default.createProduct(requestBody);
                return {
                    name: newProduct.name,
                    category: newProduct.category,
                    price: newProduct.price,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    // Get the specific item base on id: /v1/products/1234...
    getItemById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield product_service_1.default.getProductById(id);
                return {
                    message: "success",
                    data: product,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    //Update the specific item base on id: /v1/products/123..
    updateItem(id, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateProduct = yield product_service_1.default.updateProduct(id, requestBody);
                return { message: "success", data: updateProduct };
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteItemById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield product_service_1.default.deleteProduct(id);
            }
            catch (error) {
                throw error;
            }
        });
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, tsoa_1.Get)(),
    __param(0, (0, tsoa_1.Queries)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof product_request_type_1.ProductGetAllRequest !== "undefined" && product_request_type_1.ProductGetAllRequest) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getAllProducts", null);
__decorate([
    (0, tsoa_1.Post)(),
    (0, tsoa_1.Response)(201, "Created success"),
    (0, tsoa_1.Middlewares)((0, validate_input_1.default)(product_schema_1.default)),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof product_request_type_1.ProductCreateRequest !== "undefined" && product_request_type_1.ProductCreateRequest) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "createItem", null);
__decorate([
    (0, tsoa_1.Get)("{id}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getItemById", null);
__decorate([
    (0, tsoa_1.Put)("{id}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof product_request_type_1.ProductUpdateRequest !== "undefined" && product_request_type_1.ProductUpdateRequest) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "updateItem", null);
__decorate([
    (0, tsoa_1.Delete)("{id}"),
    (0, tsoa_1.Response)(204, "Delete Success"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "deleteItemById", null);
exports.ProductController = ProductController = __decorate([
    (0, tsoa_1.Route)("v1/products")
], ProductController);
//# sourceMappingURL=product.controller.js.map