import { Request, Response } from 'express';
import {
  IUserRegister,
  IUserRequest,
  IUserResponse,
} from './../Interfaces/user';
import {
  generateRefreshToken,
  generateToken,
  validateToken,
} from './../utils/jwt';
import User, { IUser } from '../models/user';
import env from 'dotenv';
import Session from '../models/session';
import { users } from '../data/user';

env.config();

const EXP_REFRESH_TOKEN = process.env.HASH_ROUNDS
  ? Number(process.env.HASH_ROUNDS)
  : 12;

console.log({ EXP_REFRESH_TOKEN });

const generateTokenUser = (
  user: IUser
): [accessToken: string, refreshToken: string] => {
  const userResponse: IUserResponse = {
    _id: user.id,
    lastName: user.lastName,
    firstName: user.firstName,
    email: user.email,
    schoolId: user.schoolId,
    dateOfBirth: user.dateOfBirth,
    role: user.role,
  };
  return [generateToken(userResponse), generateRefreshToken(userResponse)];
};

export const login = async (
  req: Request,
  res: Response
): Promise<Response<void>> => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const user = await User.findOne({ email }).exec();

    if (!user) throw new Error('Not Found Email');
    if (!(await user.validatePassword(password)))
      throw new Error('incorrect password');

    const [accessToken, refreshToken] = generateTokenUser(user);
    await validateToken(accessToken);

    return res.json({
      accessToken,
      refreshToken,
      userInfo: user,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error?.message });
  }
};

export const register = async (
  req: Request,
  res: Response
): Promise<Response<void>> => {
  try {
    const { email, lastName, firstName, schoolId, password, dateOfBirth } =
      req.body as IUserRegister;

    const user = new User({
      lastName,
      firstName,
      email,
      schoolId,
      dateOfBirth,
      passHash: password,
    });

    await user.save();

    return res.json(user);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const seedUser = async (
  req: Request,
  res: Response
): Promise<Response<void>> => {
  try {
    await User.remove();
    users.forEach(async (x) => {
      const user = new User(x);
      await user.save();
    });

    return res.json(await User.find());
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getInfoUser = async (
  req: Request,
  res: Response
): Promise<Response<void>> => {
  try {
    const user = req as IUserRequest;

    return res.json(user.user);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAllUserAdmin = async (
  req: Request,
  res: Response
): Promise<Response<void>> => {
  try {
    const userReq = req as IUserRequest;

    const users = await User.find({ _id: { $ne: userReq.user?._id } });

    return res.json(users);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<Response<void>> => {
  try {
    console.log(new Date(req.body.dateOfBirth));

    const user = new User({
      ...req.body,
      passHash: req.body.password,
    });

    await user.save();
    return res.json(user);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response<void>> => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndRemove(id);

    return res.json(user);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
