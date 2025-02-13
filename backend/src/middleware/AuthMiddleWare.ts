import { configDotenv } from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
configDotenv();

declare global {
  namespace Express {
    interface Request {
      user : any;
    }
  }
}

export default class AuthMiddleWare {
  static async verifyUser(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.jwt;
      // const token = req.headers.cookie?.slice(4) ?? '';
      const verified = jwt.verify(token, process.env.SECRET as string) as JwtPayload; // Явное приведение типа
      req.user = verified;
      next();
    } catch (error) {
      return res.status(401).json({ msg: "Не авторизован" });
    }
  }
}
