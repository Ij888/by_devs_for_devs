import { Router } from "express";
import {
  createRecruiterIncident,
  deleteRecruiterIncident,
  listRecruiterIncidents,
  updateRecruiterIncident
} from "../../db/sqlite.js";

export const recruiterIncidentsRouter = Router();

recruiterIncidentsRouter.get("/", (_req, res) => {
  res.json({ data: listRecruiterIncidents() });
});

recruiterIncidentsRouter.post("/", (req, res) => {
  const { recruiter, offence, penalty, severity } = req.body ?? {};

  if (!recruiter || !offence || !penalty || !severity) {
    res.status(400).json({ error: "recruiter, offence, penalty, and severity are required" });
    return;
  }

  const created = createRecruiterIncident({
    recruiter: String(recruiter).trim(),
    offence: String(offence).trim(),
    penalty: String(penalty).trim(),
    severity: String(severity).trim()
  });

  res.status(201).json({ data: created });
});

recruiterIncidentsRouter.patch("/:id", (req, res) => {
  const { recruiter, offence, penalty, severity } = req.body ?? {};

  if (!recruiter || !offence || !penalty || !severity) {
    res.status(400).json({ error: "recruiter, offence, penalty, and severity are required" });
    return;
  }

  const updated = updateRecruiterIncident(req.params.id, {
    recruiter: String(recruiter).trim(),
    offence: String(offence).trim(),
    penalty: String(penalty).trim(),
    severity: String(severity).trim()
  });

  if (!updated) {
    res.status(404).json({ error: "Recruiter incident not found" });
    return;
  }

  res.json({ data: updated });
});

recruiterIncidentsRouter.delete("/:id", (req, res) => {
  const deleted = deleteRecruiterIncident(req.params.id);

  if (!deleted) {
    res.status(404).json({ error: "Recruiter incident not found" });
    return;
  }

  res.status(204).send();
});
