import { NextFunction, Request, Response } from "express";
import { verify_access_jwt } from "../utils/jwt_utils";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1];

  if (!authorization || !token) {
    return res.status(401).json({
      message: "Missing Access Token",
    });
  }
  const result = verify_access_jwt(token);

  if (!result.ok)
    return res.status(401).json({
      message: result.error.message,
    });
  next();
};
