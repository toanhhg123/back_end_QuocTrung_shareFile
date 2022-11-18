import { model, Schema, Model, Document } from 'mongoose';

interface ITypeFile extends Document {
  name: string;
}

const TypeFileSchema: Schema = new Schema(
  {
    name: { type: String, require: [true, 'School name is require'] },
  },
  {
    timestamps: true,
  }
);

const TypeFile: Model<ITypeFile> = model<ITypeFile>('TypeFile', TypeFileSchema);

export default TypeFile;
