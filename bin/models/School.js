"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const shoolSchema = new mongoose_1.Schema({
    name: { type: String, require: [true, 'School name is require'] },
}, {
    timestamps: true,
});
shoolSchema.pre('validate', { document: true }, function (next) {
    if (!this.name && this.name.length < 10) {
        next(new Error('Invalid school name'));
    }
    else
        next();
});
const School = (0, mongoose_1.model)('Shool', shoolSchema);
exports.default = School;
