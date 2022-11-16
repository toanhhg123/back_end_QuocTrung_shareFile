import "dotenv/config";
import { sign, SignOptions, verify, VerifyOptions } from "jsonwebtoken";
import { IUserResponse } from "../Interfaces/user";

type PayLoad = string | object | Buffer;

const privateKey = process.env.JWT_PRIVATEKEY || "No key";

console.log({ privateKey });

export const generateToken = (payload: PayLoad): string => {
  const signInOptions: SignOptions = {
    expiresIn: "1d",
  };

  return sign(payload, privateKey, signInOptions);
};

export const generateRefreshToken = (payload: PayLoad): string => {
  const privateKey = process.env.JWT_PRIVATEKEY || "No key";

  const signInOptions: SignOptions = {
    expiresIn: "10d",
  };

  return sign(payload, privateKey, signInOptions);
};

export function validateToken(token: string): Promise<IUserResponse> {
  return new Promise((resolve, reject) => {
    const verifyOptions: VerifyOptions = {
      algorithms: ["RS256"],
    };

    try {
      const decode = verify(token, privateKey);

      return resolve(decode as IUserResponse);
    } catch (error) {
      console.log({ error });

      return reject(error);
    }
  });
}
