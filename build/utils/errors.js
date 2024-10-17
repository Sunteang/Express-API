"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.ResourceConflictError = exports.AuthorizationError = exports.AuthenticationError = exports.NotFoundError = exports.InvalidInputError = exports.ApplicationError = void 0;
const status_code_1 = require("@/src/utils/constants/status-code");
class ApplicationError extends Error {
    constructor({ message, status, errors, }) {
        super(message);
        this.status = status;
        this.errors = errors;
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}
exports.ApplicationError = ApplicationError;
// ========================
// Client Error
// ========================
class InvalidInputError extends ApplicationError {
    constructor({ message = "Invalid input provided.", errors, }) {
        super({ message, status: status_code_1.HTTP_STATUS_CODE.BAD_REQUEST, errors });
    }
}
exports.InvalidInputError = InvalidInputError;
class NotFoundError extends ApplicationError {
    constructor(message = "The requested resource was not found.") {
        super({ message, status: status_code_1.HTTP_STATUS_CODE.NOT_FOUND });
    }
}
exports.NotFoundError = NotFoundError;
class AuthenticationError extends ApplicationError {
    constructor(message = "Authentication failed. Please check your credentials.") {
        super({ message, status: status_code_1.HTTP_STATUS_CODE.UNAUTHORIZED });
    }
}
exports.AuthenticationError = AuthenticationError;
class AuthorizationError extends ApplicationError {
    constructor(message = "You do not have permission to access this resource.") {
        super({ message, status: status_code_1.HTTP_STATUS_CODE.FORBIDDEN });
    }
}
exports.AuthorizationError = AuthorizationError;
class ResourceConflictError extends ApplicationError {
    constructor(message = "Resource conflict occurred. The resource might already exist.") {
        super({ message, status: status_code_1.HTTP_STATUS_CODE.CONFLICT });
    }
}
exports.ResourceConflictError = ResourceConflictError;
// ========================
// Server Error
// ========================
class InternalServerError extends ApplicationError {
    constructor({ message = "An internal server error occurred.", errors, }) {
        super({ message, status: status_code_1.HTTP_STATUS_CODE.SERVER_ERROR, errors });
    }
}
exports.InternalServerError = InternalServerError;
// Add More Possible Error
//# sourceMappingURL=errors.js.map