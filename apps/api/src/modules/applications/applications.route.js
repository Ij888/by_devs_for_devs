import { Router } from "express";
import { insertApplication, listApplications } from "../../db/sqlite.js";

export const applicationsRouter = Router();

applicationsRouter.get("/", (_req, res) => {
  res.json({ data: listApplications() });
});

applicationsRouter.post("/", (req, res) => {
  const { company, role, status } = req.body ?? {};

  if (!company || !role || !status) {
    res.status(400).json({ error: "company, role, and status are required" });
    return;
  }

  const application = {
    id: `app-${Date.now()}`,
    company: String(company).trim(),
    role: String(role).trim(),
    status: String(status).trim(),
    createdAt: new Date().toISOString()
  };

  const created = insertApplication(application);
  res.status(201).json({ data: created });
});
