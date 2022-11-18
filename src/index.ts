import * as dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import connect from './connect/mogodb';
import schoolRouter from './routes/school';
import userRouter from './routes/user';
import subjectRouter from './routes/subject';

import { seedFolder, seedSpecialize } from './seedFolders';
import path from 'path';

import bodyParser from 'body-parser';
import cors from 'cors';
import filerouter from './routes/file';
import specialRoute from './routes/specialized';

import fs from 'fs';
import Specialized from './models/specialized';
import subjects from './models/subjects';

import fileSchema from './models/file';

dotenv.config();
const app = express();

app.use(cors()); /* NEW */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/files', express.static(path.join(__dirname, 'uploads')));

const port = process.env.PORT;
connect();
// connect().then(() => {
//   fs.readdir('src/data/files', (err, files) => {
//     // files.forEach(async (file) => {
//     //   const fileNew = await fileSchema.create({
//     //     name: file.toString(),
//     //     subjects: '6375ca86c74e521bf53547dc',
//     //     fileId: file.toString(),
//     //     type: file.split('.').pop(),
//     //     userId: '636483cfe6bb227603f2512d',
//     //     isAcctive: true,
//     //   });
//     //   console.log(fileNew);
//     //   process.exit();
//     // });
//   });
// });

app.use('/auth', userRouter);
app.use('/school', schoolRouter);
app.use('/file', filerouter);
app.use('/specialized', specialRoute);
app.use('/subject', subjectRouter);

app.get('/seedFolder', seedSpecialize);

app.listen(port, () => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
