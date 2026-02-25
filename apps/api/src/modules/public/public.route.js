import { Router } from "express";
import { mockThings } from "../../data/mockThings.js";

export const publicRouter = Router();

publicRouter.get("/things", (_req, res) => {
  const sanitised = mockThings.map(({ id, company, role, status, createdAt }) => ({
    id,
    company,
    role,
    status,
    createdAt
  }));

  res.json({ data: sanitised });
});
