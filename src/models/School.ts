import { model, Schema, Model, Document } from 'mongoose';

interface IShcool extends Document {
  name: string;
}

const shoolSchema: Schema = new Schema(
  {
    name: { type: String, require: [true, 'School name is require'] },
  },
  {
    timestamps: true,
  }
);

shoolSchema.pre('validate', { document: true }, function (next) {
  if (!this.name && this.name.length < 10) {
    next(new Error('Invalid school name'));
  } else next();
});

const School: Model<IShcool> = model<IShcool>('Shool', shoolSchema);

export default School;
