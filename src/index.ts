import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import connect from "./connect/mogodb";
import schoolRouter from "./routes/school";
import userRouter from "./routes/user";
import { seedFolder } from "./seedFolders";
import path from "path";

import bodyParser from "body-parser";
import cors from "cors";
import filerouter from "./routes/file";

dotenv.config();
const app = express();

app.use(cors()); /* NEW */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/files", express.static(path.join(__dirname, "uploads")));

const port = process.env.PORT;
connect();

app.use("/auth", userRouter);
app.use("/school", schoolRouter);
app.use("/file", filerouter);
app.get("/seedFolder", seedFolder);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
