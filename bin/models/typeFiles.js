"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TypeFileSchema = new mongoose_1.Schema({
    name: { type: String, require: [true, "School name is require"] },
}, {
    timestamps: true,
});
const TypeFile = (0, mongoose_1.model)("TypeFile", TypeFileSchema);
exports.default = TypeFile;
