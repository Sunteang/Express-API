"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = globalErrorHandler;
const app_error_message_1 = require("@/src/utils/constants/app-error-message");
const status_code_1 = require("@/src/utils/constants/status-code");
const errors_1 = require("@/src/utils/errors");
function globalErrorHandler(error, _req, res, _next) {
    //Handle error
    if (error instanceof errors_1.ApplicationError) {
        const status = error.status;
        const message = error.message;
        const errors = error.errors;
        console.error(`$UserService - globalErrorHandler() method error: ${error}`);
        return res.status(status).json({ message, error: errors });
    }
    // unknown error
    console.error(`$UserService - globalErrorHandler() method unexpected error: ${error}`);
    res
        .status(status_code_1.HTTP_STATUS_CODE.SERVER_ERROR)
        .json({ message: app_error_message_1.APP_ERROR_MESSAGE.serverError });
}
//# sourceMappingURL=global-error.js.map