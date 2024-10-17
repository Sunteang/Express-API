"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateRequest = (schema) => {
    return (req, _res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const errors = error.details.map((detail) => detail.message);
            return next(new Error(errors.toString()));
        }
        next();
    };
};
exports.default = validateRequest;
//# sourceMappingURL=validate-input.js.map