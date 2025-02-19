import express, { NextFunction, Request, Response } from "express";
const app = express();
app.use(express.json());
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const KEY = process.env.SECRET_KEY;
if (!KEY) {
  throw new Error("Secret key undefined");
}

declare module "express" {
  interface Request {
    userId?: string;
  }
}

export const UserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers["authorization"];
  if (!token) {
    res.status(401).json({ error: "Access Denied" });
    return;
  }

  try {
    const decode = jwt.verify(token, KEY) as { id: string };
    if (decode && decode.id) {
      req.userId = decode.id;
      next();
    } else {
      res.status(403).json({ message: "Invalid token payload" });
    }
  } catch (error) {
    console.error(error);
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Token expired" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: "Invalid token" });
    } else {
      res.status(500).json({ error: "Unable to decode the JWT" });
    }
  }
};

