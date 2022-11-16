import { Request, Response } from "express";
import googleDriver from "../utils/file";
import { IUserRequest } from "../Interfaces/user";
import FileSchema, { IFile } from "../models/file";

export const uploadFile = async (
  req: Request,
  res: Response
): Promise<Response<any>> => {
  try {
    const { user } = req as IUserRequest;

    console.log({ user });

    if (!user) throw new Error("not found user");

    const file = req.file;
    if (!file) throw new Error("Not found file in request");

    console.log({ file });

    const folder = (await googleDriver.searchFolder("Files")) || [];
    console.log({ folder });

    if (!folder.length) throw new Error("Not found folder");

    const fileSave = await googleDriver.saveFile(
      file.filename,
      file.path,
      file.mimetype,
      folder[0].id || undefined
    );
    let filePublic = null;
    if (fileSave.data.id)
      filePublic = await googleDriver.setFilePublic(fileSave.data.id);

    if (!filePublic) throw new Error("not set public file");

    const fileUpload = new FileSchema({
      name: file.filename,
      userId: user._id,
      linkDriver: filePublic.data.webViewLink,
      type: file.mimetype,
      isAcctive: true,
      fileId: fileSave.data.id,
    });

    await fileUpload.save();
    return res.json(fileUpload);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const delefile = async (
  req: Request<{ fileId: string }, string, { id: string; fileId: string }>,
  res: Response
): Promise<Response<any>> => {
  try {
    const { fileId } = req.params;

    await googleDriver.DeleteFile(fileId);

    const fileRemove = await FileSchema.remove({ fileId });

    return res.json(fileRemove);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAllFile = async (
  req: Request<{ fileId: string }, string, { id: string; fileId: string }>,
  res: Response
): Promise<Response<any>> => {
  try {
    const { user } = req as IUserRequest;

    console.log(user);

    const files = await FileSchema.find({ userId: user?._id });

    return res.json(files);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAllFilePublic = async (
  req: Request<{ fileId: string }, string, { id: string; fileId: string }>,
  res: Response
): Promise<Response<any>> => {
  try {
    const files = await FileSchema.find({});

    return res.json(files);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const uploadFileServer = async (
  req: Request<{}, any, IFile>,
  res: Response
): Promise<Response<any>> => {
  try {
    const file = req.file;
    const fileBody = req.body;
    if (!file) throw new Error("not found file create");

    const { originalname } = file;
    fileBody.type = originalname.split(".")[-1];
    const fileNew = FileSchema.create({});
    return res.json(req.file);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
