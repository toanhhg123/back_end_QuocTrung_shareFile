import { Request, Response } from 'express';
import Specialized from '../models/specialized';

export const getAllSpecialized = async (req: Request, res: Response) => {
  try {
    const data = await Specialized.find().populate(
      'subjectList',
      '',
      'Subject',
      'specialized'
    );
    return res.json(data);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
