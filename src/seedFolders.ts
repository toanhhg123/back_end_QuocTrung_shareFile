import { Request, Response } from 'express';
import GoogleDriveService from './utils/file';
import Specialized from './models/specialized';

export const seedFolder = async (req: Request, res: Response) => {
  try {
    const publicFolder = await GoogleDriveService.createFolder('PublicFiles');
    return res.json(publicFolder);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const seedSpecialize = async (req: Request, res: Response) => {
  try {
    await Specialized.remove();
    const data = await Specialized.insertMany(chuyennganh);
    return res.json(data);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

const chuyennganh = [
  {
    name: 'Công nghệ sinh học',
  },
  {
    name: 'Công nghệ chế tạo máy',
  },
  {
    name: 'An toàn thông tin',
  },
  {
    name: 'Quản trị kinh doanh thực phẩm',
  },
  {
    name: 'Công nghệ kỹ thuật điện - điện tử',
  },
  {
    name: 'Công nghệ kỹ thuật cơ điện tử',
  },
  {
    name: 'Quản trị khách sạn',
  },
  {
    name: 'Ngôn ngữ Anh',
  },
  {
    name: 'Ngôn ngữ Trung Quốc',
  },
  {
    name: 'Kinh tế chính trị',
  },
];
