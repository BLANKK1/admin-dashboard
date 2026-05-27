import { Router } from "express";
import { getRecords } from "../data/store.js";
import {
  requireAuth,
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

  const records = getRecords(req.authUser!.role);

  res.json({
    records,
    meta: {
      total: records.length,
      delay: clampedDelay,
      role: req.authUser!.role,
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
