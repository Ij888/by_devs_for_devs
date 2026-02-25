import { Router } from "express";
import { mockThings } from "../../data/mockThings.js";

export const thingsRouter = Router();

thingsRouter.get("/collection/:collectionId", (req, res) => {
  const data = mockThings.filter((t) => t.collectionId === req.params.collectionId);
  res.json({ data });
});

thingsRouter.get("/:id", (req, res) => {
  const item = mockThings.find((t) => t.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Thing not found" });
  res.json({ data: item });
});

thingsRouter.post("/", (_req, res) => {
  res.status(501).json({ error: "Use POST /collections/:id/things (planned route)" });
});

thingsRouter.patch("/:id", (_req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

thingsRouter.delete("/:id", (_req, res) => {
  res.status(501).json({ error: "Not implemented" });
});
