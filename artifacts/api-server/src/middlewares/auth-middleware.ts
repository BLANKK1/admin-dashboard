import { Request, Response, NextFunction } from "express";
import { validateSession, getUserByUserId } from "../data/store.js";

export interface AuthenticatedUser {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  createdAt: string;
}

export interface AuthRequest extends Request {
  authUser?: AuthenticatedUser;
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ error: "Unauthorized", message: "Missing or invalid token" });
    return;
  }

  const token = authHeader.split(" ")[1]!;
  const session = validateSession(token);

  if (!session) {
    res
      .status(401)
      .json({ error: "Unauthorized", message: "Token expired or invalid" });
    return;
  }

  const user = getUserByUserId(session.userId);
  if (!user) {
    res
      .status(401)
      .json({ error: "Unauthorized", message: "User not found" });
    return;
  }

  const { password: _p, ...safeUser } = user;
  req.authUser = safeUser;
  next();
}

export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  if (req.authUser?.role !== "admin") {
    res
      .status(403)
      .json({ error: "Forbidden", message: "Admin access required" });
    return;
  }
  next();
}
