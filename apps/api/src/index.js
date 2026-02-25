import express from "express";
import cors from "cors";
import { apiRouter } from "./routes/index.js";

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());
app.use(apiRouter);

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
