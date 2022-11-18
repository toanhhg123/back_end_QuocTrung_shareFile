import { Document, model, Model, Schema } from 'mongoose';
import { ISubjects } from './subjects';

interface ISpecialized extends Document {
  name: string;
  subjects: ISubjects[];
}

const SpecializedSchema: Schema = new Schema(
  {
    name: { type: String, require: [true, 'Specialized name is require'] },
    subjectList: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
  },
  {
    timestamps: true,
  }
);

SpecializedSchema.pre('validate', { document: true }, function (next) {
  if (!this.name && this.name.length < 10) {
    next(new Error('Invalid Specialized name'));
  } else next();
});

const Specialized: Model<ISpecialized> = model<ISpecialized>(
  'Specialized',
  SpecializedSchema
);

export default Specialized;
