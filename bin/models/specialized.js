"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SpecializedSchema = new mongoose_1.Schema({
    name: { type: String, require: [true, 'Specialized name is require'] },
    subjectList: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Subject' }],
}, {
    timestamps: true,
});
SpecializedSchema.pre('validate', { document: true }, function (next) {
    if (!this.name && this.name.length < 10) {
        next(new Error('Invalid Specialized name'));
    }
    else
        next();
});
const Specialized = (0, mongoose_1.model)('Specialized', SpecializedSchema);
exports.default = Specialized;
