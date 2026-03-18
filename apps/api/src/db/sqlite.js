import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDirectory = path.resolve(__dirname, "../../data");
const databasePath = path.join(dataDirectory, "applications.sqlite");

fs.mkdirSync(dataDirectory, { recursive: true });

export const db = new Database(databasePath);

export function initialiseSqlite() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      company TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  const count = db.prepare("SELECT COUNT(*) AS count FROM applications").get();

  if (count.count === 0) {
    const seed = db.prepare(`
      INSERT INTO applications (id, company, role, status, created_at)
      VALUES (@id, @company, @role, @status, @createdAt)
    `);

    seed.run({
      id: "app-1",
      company: "Tech Native",
      role: "Frontend Developer",
      status: "Applied",
      createdAt: "2026-03-18T19:00:00.000Z"
    });

    seed.run({
      id: "app-2",
      company: "Acme Labs",
      role: "Full Stack Engineer",
      status: "Interview",
      createdAt: "2026-03-17T15:30:00.000Z"
    });
  }
}

export function listApplications() {
  return db
    .prepare(`
      SELECT
        id,
        company,
        role,
        status,
        created_at AS createdAt
      FROM applications
      ORDER BY datetime(created_at) DESC, rowid DESC
    `)
    .all();
}

export function insertApplication({ id, company, role, status, createdAt }) {
  db.prepare(`
    INSERT INTO applications (id, company, role, status, created_at)
    VALUES (@id, @company, @role, @status, @createdAt)
  `).run({
    id,
    company,
    role,
    status,
    createdAt
  });

  return db
    .prepare(`
      SELECT
        id,
        company,
        role,
        status,
        created_at AS createdAt
      FROM applications
      WHERE id = ?
    `)
    .get(id);
}
