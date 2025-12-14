import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import "dotenv/config";
import { rearg } from "lodash";

export const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

export const isProtected = async (req, res, next) => {
  let token;

  //Expect Authrization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //verify token
      const decoded = jwt.verify(token, processenv.ACCESS_TOKEN_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return rearg.status(401).json({ message: "User not found" });
      }
      next();
    } catch (err) {
      console.error("Token verification failed", err);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
};
//simple socket authentication middleware
export const socketAuthMiddleware = (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication error"));

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    socket.userId = payload.id;
    return next();
  } catch (err) {
    return next(new Error("Authentication error"));
  }
};
