import { Router } from "express";
import {
  getAllRecords,
  getRecords,
  updateRecordAccess,
  getUserByUserId,
  addAuditEntry,
} from "../data/store.js";
import {
  requireAuth,
  requireAdmin,
  type AuthRequest,
} from "../middlewares/auth-middleware.js";

const router: Router = Router();

router.get("/records", requireAuth, async (req: AuthRequest, res) => {
  const rawDelay = req.query["delay"] as string | undefined;
  const delay = parseInt(rawDelay ?? "0", 10);
  const clampedDelay = Math.min(Math.max(isNaN(delay) ? 0 : delay, 0), 10000);

  if (clampedDelay > 0) {
    await new Promise((resolve) => setTimeout(resolve, clampedDelay));
  }

  const filtered = getRecords(req.authUser!.role);
  const total = getAllRecords().length;

  res.json({
    records: filtered,
    meta: {
      total: filtered.length,
      totalInStore: total,
      delay: clampedDelay,
      role: req.authUser!.role,
      timestamp: new Date().toISOString(),
    },
  });
});

router.get("/records/all", requireAuth, requireAdmin, (_req, res) => {
  res.json({ records: getAllRecords() });
});

router.patch(
  "/records/:id/access",
  requireAuth,
  requireAdmin,
  (req: AuthRequest, res) => {
    const { id } = req.params as { id: string };
    const { accessLevel } = req.body as { accessLevel?: string };

    if (accessLevel !== "all" && accessLevel !== "admin") {
      res.status(400).json({
        error: "Bad Request",
        message: 'accessLevel must be "all" or "admin"',
      });
      return;
    }

    const updated = updateRecordAccess(id, accessLevel);
    if (!updated) {
      res.status(404).json({ error: "Not Found", message: "Record not found" });
      return;
    }

    const actorId = req.authUser?.userId ?? "unknown";
    const actor = getUserByUserId(actorId);
    addAuditEntry({
      action: "record_access_update",
      actorId,
      actorName: actor?.name ?? actorId,
      targetId: updated.id,
      targetName: updated.title,
      detail: `Set "${updated.title}" access to ${accessLevel === "all" ? "Public" : "Restricted"}`,
    });

    res.json({ record: updated, message: "Access level updated" });
  },
);

export default router;
