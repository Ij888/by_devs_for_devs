import { Router } from "express";
import { mockCollections } from "../../data/mockCollections.js";

export const collectionsRouter = Router();

collectionsRouter.get("/", (_req, res) => {
  res.json({ data: mockCollections });
});

collectionsRouter.get("/:id", (req, res) => {
  const item = mockCollections.find((c) => c.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Collection not found" });
  res.json({ data: item });
});

collectionsRouter.post("/", (_req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

collectionsRouter.patch("/:id", (_req, res) => {
  res.status(501).json({ error: "Not implemented" });
});

collectionsRouter.delete("/:id", (_req, res) => {
  res.status(501).json({ error: "Not implemented" });
});
