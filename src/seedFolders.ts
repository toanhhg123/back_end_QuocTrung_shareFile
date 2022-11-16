import { Request, Response } from "express";
import GoogleDriveService from "./utils/file";

export const seedFolder = async (req: Request, res: Response) => {
  try {
    const publicFolder = await GoogleDriveService.createFolder("PublicFiles");
    return res.json(publicFolder);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
