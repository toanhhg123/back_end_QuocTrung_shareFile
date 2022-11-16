import { model, Schema, Model, Document } from 'mongoose';

interface ISession extends Document {
    idUser: string;
    refreshToken: string;
    expTime: Date
}

const sessionSchema: Schema = new Schema({
    idUser: { type: String, require: true },
    refreshToken: { type: String, require: true },
    expTime: { type: Date, require: true },
});

const Session: Model<ISession> = model<ISession>('session', sessionSchema);
export default Session;
