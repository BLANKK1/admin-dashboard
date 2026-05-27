import { Router } from "express";
import { getAllUsers, createUser, updateUser, deleteUser } from "../data/store.js";
import {
  requireAuth,
  requireAdmin,
  type AuthRequest,
} from "../middlewares/auth-middleware.js";

const router: Router = Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get("/users", (_req, res) => {
  res.json({ users: getAllUsers() });
});

router.post("/users", (req: AuthRequest, res) => {
  const { userId, name, email, role, department, status, password } =
    req.body as Record<string, string>;

  if (!userId || !name || !email || !role || !department || !password) {
    res
      .status(400)
      .json({ error: "Bad Request", message: "Missing required fields" });
    return;
  }

  if (role !== "admin" && role !== "general") {
    res.status(400).json({ error: "Bad Request", message: "Invalid role" });
    return;
  }

  const user = createUser({
    userId,
    name,
    email,
    role: role as "admin" | "general",
    department,
    status: (status as "active" | "inactive") || "active",
    password,
    createdAt: new Date().toISOString().split("T")[0]!,
  });

  res.status(201).json({ user, message: "User created successfully" });
});

router.put("/users/:id", (req: AuthRequest, res) => {
  const { id } = req.params as { id: string };
  const { name, email, role, department, status, password } = req.body as Record<string, string>;

  const updated = updateUser(id, {
    ...(name && { name }),
    ...(email && { email }),
    ...(role && { role: role as "admin" | "general" }),
    ...(department && { department }),
    ...(status && { status: status as "active" | "inactive" }),
    ...(password && { password }),
  });

  if (!updated) {
    res.status(404).json({ error: "Not Found", message: "User not found" });
    return;
  }

  res.json({ user: updated, message: "User updated successfully" });
});

router.delete("/users/:id", (req: AuthRequest, res) => {
  const { id } = req.params as { id: string };

  if (req.authUser?.id === id) {
    res
      .status(400)
      .json({ error: "Bad Request", message: "Cannot delete yourself" });
    return;
  }

  const success = deleteUser(id);

  if (!success) {
    res.status(404).json({ error: "Not Found", message: "User not found" });
    return;
  }

  res.json({ message: "User deleted successfully" });
});

export default router;
