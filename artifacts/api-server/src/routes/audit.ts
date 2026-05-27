import { Router } from "express";
import { getAuditEntries } from "../data/store.js";
import {
  requireAuth,
  requireAdmin,
} from "../middlewares/auth-middleware.js";

const router: Router = Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get("/audit", (_req, res) => {
  res.json({ entries: getAuditEntries() });
});

export default router;
