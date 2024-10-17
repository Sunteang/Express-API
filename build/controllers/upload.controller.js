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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const tsoa_1 = require("tsoa");
const uploadImage_1 = require("../middlewares/uploadImage");
const product_schema_1 = __importDefault(require("@/src/schema/product.schema"));
const product_model_1 = __importDefault(require("@/src/database/models/product.model")); // Import the Product model
let UploadController = class UploadController extends tsoa_1.Controller {
    uploadFile(request, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield new Promise((resolve, reject) => {
                    uploadImage_1.upload.single("image")(request, res, (error) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve();
                    });
                });
                // Validate form data using Joi
                const { error: validationError, value } = product_schema_1.default.validate(request.body, {
                    abortEarly: false,
                    convert: true,
                });
                if (validationError) {
                    this.setStatus(400);
                    const errorMessages = validationError.details
                        .map((detail) => detail.message)
                        .join(", ");
                    throw new Error(`Validation error: ${errorMessages}`);
                }
                const file = request.file;
                // Create a new product document
                const newProduct = new product_model_1.default({
                    name: value.name,
                    price: value.price,
                    description: value.description,
                    fileLocation: file.location, // S3 file URL
                });
                // Save the product to MongoDB
                const savedProduct = yield newProduct.save();
                this.setStatus(201); // Set HTTP status to 201 Created
                return {
                    message: "Product created successfully",
                    product: savedProduct,
                };
            }
            catch (error) {
                this.setStatus(400);
                return { message: error.message };
            }
        });
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, tsoa_1.Post)("/"),
    (0, tsoa_1.SuccessResponse)("201", "Product created successfully"),
    (0, tsoa_1.Response)("400", "Bad Request"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadFile", null);
exports.UploadController = UploadController = __decorate([
    (0, tsoa_1.Route)("upload"),
    (0, tsoa_1.Tags)("Upload")
], UploadController);
//# sourceMappingURL=upload.controller.js.map