import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY as string);
    req.cookies = decoded; // add the decoded token to the request object
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ success: false, message: "Failed to authenticate token" });
  }
};

export default verifyToken;
