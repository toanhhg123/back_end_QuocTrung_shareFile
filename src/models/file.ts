import { model, Schema, Model, Document } from "mongoose";

export interface IFile extends Document {
  name: string;
  userId: string;
  linkDriver: string;
  type: string;
  isAcctive: boolean;
  fileId: string;
}

const fileSchema: Schema = new Schema(
  {
    name: { type: String, require: [true, "file name is require"] },
    userId: { type: String, require: true },
    linkDriver: { type: String, require: true },
    type: { type: String, require: true },
    isAcctive: { type: Boolean, require: true },
    fileId: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

fileSchema.pre<IFile>("validate", { document: true }, function (next) {
  if (!this.name && this.name.length < 10) {
    next(new Error("Invalid file name"));
  } else next();
});

const file: Model<IFile> = model<IFile>("File", fileSchema);

export default file;
