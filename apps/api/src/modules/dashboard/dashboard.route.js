import { Router } from "express";
import { getDashboardSummary } from "../../db/sqlite.js";

export const dashboardRouter = Router();

dashboardRouter.get("/summary", (_req, res) => {
  res.json({ data: getDashboardSummary() });
});
