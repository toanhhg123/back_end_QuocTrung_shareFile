"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const subjectsSchema = new mongoose_1.Schema({
    name: { type: String, require: [true, 'subjects name is require'] },
    specialized: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Specialized' },
}, {
    timestamps: true,
});
subjectsSchema.pre('validate', { document: true }, function (next) {
    if (!this.name && this.name.length < 10) {
        next(new Error('Invalid subject name'));
    }
    else
        next();
});
const subjects = (0, mongoose_1.model)('Subject', subjectsSchema);
exports.default = subjects;
