import { Router } from "express";
import {
  createRecruiterQuote,
  deleteRecruiterQuote,
  listRecruiterQuotes,
  updateRecruiterQuote
} from "../../db/sqlite.js";

export const recruiterQuotesRouter = Router();

recruiterQuotesRouter.get("/", (_req, res) => {
  res.json({ data: listRecruiterQuotes() });
});

recruiterQuotesRouter.post("/", (req, res) => {
  const { quote, source } = req.body ?? {};

  if (!quote || !source) {
    res.status(400).json({ error: "quote and source are required" });
    return;
  }

  const created = createRecruiterQuote({
    quote: String(quote).trim(),
    source: String(source).trim()
  });

  res.status(201).json({ data: created });
});

recruiterQuotesRouter.patch("/:id", (req, res) => {
  const { quote, source } = req.body ?? {};

  if (!quote || !source) {
    res.status(400).json({ error: "quote and source are required" });
    return;
  }

  const updated = updateRecruiterQuote(req.params.id, {
    quote: String(quote).trim(),
    source: String(source).trim()
  });

  if (!updated) {
    res.status(404).json({ error: "Recruiter quote not found" });
    return;
  }

  res.json({ data: updated });
});

recruiterQuotesRouter.delete("/:id", (req, res) => {
  const deleted = deleteRecruiterQuote(req.params.id);

  if (!deleted) {
    res.status(404).json({ error: "Recruiter quote not found" });
    return;
  }

  res.status(204).send();
});
