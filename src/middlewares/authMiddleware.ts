import { NextFunction, Request, Response } from "express";
import { TYPE_USER } from "../models/user";
import { validateToken } from "../utils/jwt";
import { IUserRequest } from "./../Interfaces/user";
export const authorize =
  (roles: TYPE_USER[]) =>
  async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
      let jwt = req.headers.authorization;

      // verify request has token
      if (!jwt) {
        return res.status(401).json({ message: "Invalid token " });
      }

      // remove Bearer if using Bearer Authorization mechanism
      if (jwt.toLowerCase().startsWith("bearer")) {
        jwt = jwt.slice("bearer".length).trim();
      }

      // verify token hasn't expired yet
      const decodedToken = await validateToken(jwt);

      if (!roles.some((x) => x === decodedToken.role))
        return res.status(403).json({ message: "forbibden" });
      req.user = decodedToken;

      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        res.status(401).json({ message: "Expired token" });
        return;
      }

      res.status(500).json({ message: "Failed to authenticate user" });
    }
  };
