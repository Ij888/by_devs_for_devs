import { Router } from "express";
import { healthRouter } from "../modules/public/health.route.js";
import { collectionsRouter } from "../modules/collections/collections.route.js";
import { thingsRouter } from "../modules/things/things.route.js";
import { publicRouter } from "../modules/public/public.route.js";
import { applicationsRouter } from "../modules/applications/applications.route.js";
import { recruiterIncidentsRouter } from "../modules/recruiter-incidents/recruiter-incidents.route.js";
import { recruiterQuotesRouter } from "../modules/recruiter-quotes/recruiter-quotes.route.js";
import { dashboardRouter } from "../modules/dashboard/dashboard.route.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/collections", collectionsRouter);
router.use("/things", thingsRouter);
router.use("/public", publicRouter);
router.use("/applications", applicationsRouter);
router.use("/recruiter-incidents", recruiterIncidentsRouter);
router.use("/recruiter-quotes", recruiterQuotesRouter);
router.use("/dashboard", dashboardRouter);

export const apiRouter = router;
