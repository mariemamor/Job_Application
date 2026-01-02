import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request to include user info
export interface AuthRequest extends Request {
  user?: {
    _id: string;
    role: "user" | "admin" | "business";
  };
}

// Middleware to check authentication
export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header or cookies
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: "Access denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded as { _id: string; role: "user" | "admin" | "business"  };
    
    next(); // allow access
  } catch (err) {
    return res.status(401).json({ status: false, message: "Invalid token" });
  }
};

export const requireBusiness = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "business") {
    return res.status(403).json({ status: false, message: "Only business accounts can create jobs" });
  }
  next();
};

// Middleware to check admin role
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ status: false, message: "Forbidden: Admins only" });
  }
  next();
};
