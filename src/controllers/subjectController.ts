import { Request, Response } from 'express';
import subjects from '../models/subjects';

export const getAllSubject = async (req: Request, res: Response) => {
  try {
    const data = await subjects.find({}).populate('specialized');
    return res.json(data);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAllSubjectsBySpecializedId = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const data = await subjects.find({ specialized: req.params.id });
    return res.json(data);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
