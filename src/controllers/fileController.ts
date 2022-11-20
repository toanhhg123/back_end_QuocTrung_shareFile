import { Request, Response } from 'express';
import googleDriver from '../utils/file';
import { IUserRequest } from '../Interfaces/user';
import FileSchema, { IFile } from '../models/file';
import fs from 'fs';

export const uploadFile = async (
  req: Request,
  res: Response
): Promise<Response<any>> => {
  try {
    const { user } = req as IUserRequest;

    console.log({ user });

    if (!user) throw new Error('not found user');

    const file = req.file;
    if (!file) throw new Error('Not found file in request');

    console.log({ file });

    const folder = (await googleDriver.searchFolder('Files')) || [];
    console.log({ folder });

    if (!folder.length) throw new Error('Not found folder');

    const fileSave = await googleDriver.saveFile(
      file.filename,
      file.path,
      file.mimetype,
      folder[0].id || undefined
    );
    let filePublic = null;
    if (fileSave.data.id)
      filePublic = await googleDriver.setFilePublic(fileSave.data.id);

    if (!filePublic) throw new Error('not set public file');

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
  req: Request<unknown, any, IFile>,
  res: Response
): Promise<Response<any>> => {
  try {
    const user = (req as IUserRequest).user;
    if (!user) throw new Error('not found user');
    const file = req.file;
    console.log(file);

    const fileBody = req.body;
    if (!file) throw new Error('not found file create');
    const { filename } = file;
    fileBody.type = filename.split('.').pop() || 'other';
    fileBody.fileId = filename;
    fileBody.linkDriver = filename;
    fileBody.isAcctive = true;
    fileBody.userId = user._id;
    console.log({ fileBody });

    const fileNew = await FileSchema.create(fileBody);
    return res.json(fileNew);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAllFilePublicServer = async (
  req: Request<unknown, unknown, unknown, { subjects: string; type: string }>,
  res: Response
): Promise<Response<any>> => {
  try {
    const { subjects, type } = req.query;
    const objQuery = {} as IFile;
    objQuery.isAcctive = true;
    subjects && (objQuery.subjects = subjects);
    type && (objQuery.type = type);

    const files = await FileSchema.find(objQuery as any).populate('subjects');
    return res.json(files);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateFile = async (
  req: Request<unknown, unknown, IFile>,
  res: Response
): Promise<Response<any>> => {
  try {
    const user = (req as IUserRequest).user;
    if (!user) throw new Error('not found user');

    const file = await FileSchema.findOne({ _id: req.body.id });
    if (!file) throw new Error('not found file');

    file.name = req.body.name || file.name;
    file.desc = req.body.desc;

    return res.json(file);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteFile = async (
  req: Request<{ id: string }, unknown>,
  res: Response
): Promise<Response<any>> => {
  try {
    console.log({ id: req.params });

    const user = (req as IUserRequest).user;
    if (!user) throw new Error('not found user');

    const file = await FileSchema.findOneAndDelete({ _id: req.params.id });
    if (!file) throw new Error('not found file');

    fs.unlinkSync('src/uploads/' + file.fileId);

    return res.json(file);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
