import express from "express";
import cors from "cors";
import { apiRouter } from "./routes/index.js";
import { initialiseSqlite } from "./db/sqlite.js";

const app = express();
const port = Number(process.env.PORT || 3000);

initialiseSqlite();

app.use(cors());
app.use(express.json());
app.use(apiRouter);

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
