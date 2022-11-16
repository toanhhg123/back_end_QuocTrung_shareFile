"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const fileSchema = new mongoose_1.Schema({
    name: { type: String, require: [true, "file name is require"] },
    userId: { type: String, require: true },
    linkDriver: { type: String, require: true },
    type: { type: String, require: true },
    isAcctive: { type: Boolean, require: true },
    fileId: { type: String, require: true },
}, {
    timestamps: true,
});
fileSchema.pre("validate", { document: true }, function (next) {
    if (!this.name && this.name.length < 10) {
        next(new Error("Invalid file name"));
    }
    else
        next();
});
const file = (0, mongoose_1.model)("File", fileSchema);
exports.default = file;
