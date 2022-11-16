import { Request, Response } from "express";
import School from "../models/School";
import { schools } from "../data/school";
import { IUserRequest } from "./../Interfaces/user";

export const seedSchool = async (
  req: Request,
  response: Response
): Promise<Response<any>> => {
  try {
    const userRequest = req as IUserRequest;

    await School.remove();
    const list = await School.insertMany(schools);
    return response.json(list);
  } catch (error: any) {
    return response.status(400).json({ message: error.message });
  }
};

export const getAllSchool = async (
  req: Request,
  res: Response
): Promise<Response<any>> => {
  try {
    const schools = await School.find({});
    return res.json(schools);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
