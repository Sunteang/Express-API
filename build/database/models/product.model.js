"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const itemSchema = new mongoose_1.Schema({
    name: { type: String, require: true },
    category: { type: String, require: true },
    price: { type: Number, require: true },
});
const ItemModel = (0, mongoose_1.model)("items", itemSchema);
exports.default = ItemModel;
//# sourceMappingURL=product.model.js.map