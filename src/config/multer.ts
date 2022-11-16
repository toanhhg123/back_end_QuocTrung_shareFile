import { Request } from "express";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (request: Request, file: Express.Multer.File, cb): void => {
    cb(null, "src/uploads");
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    console.log(file);

    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({
  storage: storage,
});
