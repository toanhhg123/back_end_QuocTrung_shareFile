import { model, Schema, Model, Document } from 'mongoose';
import TypeFile from './typeFiles';
import fs from 'fs';
import subjects from './subjects';

export interface IFile extends Document {
  name: string;
  userId: string;
  linkDriver: string;
  type: string;
  isAcctive: boolean;
  fileId: string;
  desc: string;
  subjects: string;
}

const fileSchema: Schema = new Schema(
  {
    name: { type: String, require: [true, 'file name is require'] },
    userId: { type: String, require: true },
    linkDriver: { type: String, require: true },
    type: { type: String, require: true },
    isAcctive: { type: Boolean, require: true },
    fileId: { type: String, require: true },
    desc: { type: String, require: false, default: '' },
    subjects: { type: Schema.Types.ObjectId, ref: 'Subject' },
  },
  {
    timestamps: true,
  }
);

fileSchema.pre<IFile>('validate', { document: true }, async function (next) {
  try {
    if (!this.name && this.name.length < 10) {
      next(new Error('Invalid file name'));
      fs.unlinkSync('src/uploads/' + this.fileId);
    } else if (!(await subjects.findOne({ name: this.subjects }))) {
      fs.unlinkSync('src/uploads/' + this.fileId);
      next(new Error('not found subjects'));
    } else next();
  } catch (error: any) {
    fs.unlinkSync('src/uploads/' + this.fileId);
    next(new Error(error.message));
  }
});

fileSchema.pre<IFile>('save', { document: true }, async function (next) {
  if (!(await TypeFile.findOne({ name: this.type }))) {
    await TypeFile.create({ name: this.type });
  }
});

fileSchema.pre<IFile>('insertMany', { document: true }, async function (next) {
  if (!(await TypeFile.findOne({ name: this.type }))) {
    await TypeFile.create({ name: this.type });
  }
});

fileSchema.pre<IFile>('remove', { document: true }, async function (next) {
  fs.unlinkSync('src/uploads/' + this.fileId);
});

const file: Model<IFile> = model<IFile>('File', fileSchema);

export default file;
