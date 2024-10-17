"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const routes_1 = require("@/src/routes/v1/routes");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const global_error_1 = require("@/src/middlewares/global-error");
// Dynamically load swagger.json
const swaggerDocument = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "docs/swagger.json"), "utf8"));
// ========================
// Initialize App Express
// ========================
const app = (0, express_1.default)();
// ========================
// Global Middleware
// ========================
app.use(express_1.default.json()); // Help to get the json from request body
// ========================
// Global API V1
// ========================
(0, routes_1.RegisterRoutes)(app);
// ========================
// API Documentations
// ========================
app.use("/user-api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
// ========================
// ERROR Handler
// ========================
app.use(global_error_1.globalErrorHandler);
// Handle Later
exports.default = app;
//# sourceMappingURL=app.js.map