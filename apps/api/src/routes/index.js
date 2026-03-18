import { Router } from "express";
import { healthRouter } from "../modules/public/health.route.js";
import { collectionsRouter } from "../modules/collections/collections.route.js";
import { thingsRouter } from "../modules/things/things.route.js";
import { publicRouter } from "../modules/public/public.route.js";
import { applicationsRouter } from "../modules/applications/applications.route.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/collections", collectionsRouter);
router.use("/things", thingsRouter);
router.use("/public", publicRouter);
router.use("/applications", applicationsRouter);

export const apiRouter = router;
