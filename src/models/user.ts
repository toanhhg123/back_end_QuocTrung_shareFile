import { model, Schema, Model, Document } from "mongoose";
import { validateEmail } from "../utils/validate";
import bcrypt from "bcryptjs";
import School from "./School";
import env from "dotenv";
env.config();

const HASH_ROUNDS = process.env.HASH_ROUNDS
  ? Number(process.env.HASH_ROUNDS)
  : 12;

console.log({ HASH_ROUNDS });

export type TYPE_USER = "USER" | "ADMIN";
const roles: TYPE_USER[] = ["ADMIN", "USER"];
export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  passHash: string;
  schoolId: string;
  dateOfBirth: Date;
  role: "ADMIN" | "USER";
  validatePassword(password: string): Promise<boolean>;
}

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      require: [true, "Email address is required"],
      unique: [true, "Email is exist"],
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    passHash: { type: String, require: true },
    schoolId: { type: String, require: true },
    dateOfBirth: { type: Date, require: true },
    role: { type: String, enum: roles, default: "USER" },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUser>("validate", { document: true }, async function (next) {
  if (!this.lastName) next(new Error("lastname is Empty"));
  if (!this.firstName) next(new Error("firstName is Empty"));
  if (!this.dateOfBirth) next(new Error("birth time is Empty"));
  if (!this.passHash) next(new Error("password is Empty"));

  //email
  if (!validateEmail(this.email))
    next(new Error("The e-mail field cannot be empty."));
  if (await User.findOne({ email: this.email }))
    next(new Error("Email is exist"));

  // password
  if (this.passHash.length < 6)
    next(new Error("Passwords are between 6 and 12 characters long"));

  if (!this.schoolId || !(await School.findById(this.schoolId)))
    next(new Error("School not found"));

  if (!this.role || !roles.includes(this.role)) next(new Error("Invalid role"));
  else next();
});

userSchema.pre<IUser>("save", async function (next) {
  const thisObj = this as IUser;

  if (!this.isModified("passHash")) {
    return next();
  }
  try {
    console.log("save....");

    const salt = await bcrypt.genSalt(HASH_ROUNDS);
    thisObj.passHash = await bcrypt.hash(thisObj.passHash, salt);
    return next();
  } catch (e: any) {
    return next(e);
  }
});

userSchema.pre<IUser>("insertMany", async function (next) {
  const thisObj = this as IUser;

  if (!this.isModified("passHash")) {
    return next();
  }
  try {
    console.log("save....");

    const salt = await bcrypt.genSalt(HASH_ROUNDS);
    thisObj.passHash = await bcrypt.hash(thisObj.passHash, salt);
    return next();
  } catch (e: any) {
    return next(e);
  }
});

userSchema.methods.validatePassword = async function (
  pass: string
): Promise<boolean> {
  const thisObj = this as IUser;
  return await bcrypt.compare(pass, thisObj.passHash);
};

const User: Model<IUser> = model<IUser>("User", userSchema);
export default User;
