import { model, Schema, Model, Document } from 'mongoose';

export interface ISubjects extends Document {
  name: string;
  specialized: string;
}

const subjectsSchema: Schema = new Schema(
  {
    name: { type: String, require: [true, 'subjects name is require'] },
    specialized: { type: Schema.Types.ObjectId, ref: 'Specialized' },
  },
  {
    timestamps: true,
  }
);

subjectsSchema.pre('validate', { document: true }, function (next) {
  if (!this.name && this.name.length < 10) {
    next(new Error('Invalid subject name'));
  } else next();
});

const subjects: Model<ISubjects> = model<ISubjects>('Subject', subjectsSchema);

export default subjects;
