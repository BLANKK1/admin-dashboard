import { Router } from "express";
import {
  findUserByCredentials,
  createSession,
  deleteSession,
} from "../data/store.js";
import {
  requireAuth,
  type AuthRequest,
} from "../middlewares/auth-middleware.js";

const router: Router = Router();

router.post("/auth/login", (req, res) => {
  const { userId, password, role } = req.body as {
    userId?: string;
    password?: string;
    role?: string;
  };

  if (!userId || !password) {
    res.status(400).json({
      error: "Bad Request",
      message: "userId and password are required",
    });
    return;
  }

  const user = findUserByCredentials(userId, password);

  if (!user) {
    res
      .status(401)
      .json({ error: "Unauthorized", message: "Invalid credentials" });
    return;
  }

  if (user.status === "inactive") {
    res
      .status(403)
      .json({ error: "Forbidden", message: "Account is inactive" });
    return;
  }

  if (role && user.role !== role) {
    res.status(401).json({
      error: "Unauthorized",
      message: `Incorrect role selected. This account has role: "${user.role}"`,
    });
    return;
  }

  const token = createSession(user.userId, user.role);
  const { password: _p, ...safeUser } = user;

  res.json({ token, user: safeUser, message: "Login successful" });
});

router.get("/auth/me", requireAuth, (req: AuthRequest, res) => {
  res.json({ user: req.authUser });
});

router.post("/auth/logout", requireAuth, (req: AuthRequest, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (token) deleteSession(token);
  res.json({ message: "Logged out successfully" });
});

export default router;
