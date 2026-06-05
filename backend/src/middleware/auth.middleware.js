import jwt from "jsonwebtoken";
import User from "../models/User.js";

const getToken = (req) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return req.cookies?.access_token || null;
};

export const verifyUser = (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ message: "No token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const verifyAdmin = (req, res, next) => {
  const token = getToken(req);

  console.log("TOKEN:", token);

  if (!token) {
    return res.status(401).json({
      message: "No token found",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log(error.message);

    return res.status(403).json({
      message: "Invalid token",
    });
  }
};
