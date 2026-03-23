import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDirectory = path.resolve(__dirname, "../../data");
const databasePath = process.env.SQLITE_DB_PATH || path.join(dataDirectory, "applications.sqlite");

fs.mkdirSync(dataDirectory, { recursive: true });

export const db = new Database(databasePath);

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getCount(tableName) {
  return db.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get().count;
}

function seedRecruiterIncidents() {
  const seed = db.prepare(`
    INSERT INTO recruiter_incidents (id, recruiter, offence, penalty, severity, created_at)
    VALUES (@id, @recruiter, @offence, @penalty, @severity, @createdAt)
  `);

  seed.run({
    id: "incident-1",
    recruiter: "TalentRocket",
    offence: "Sent a personalised message that still had [FirstName] in it.",
    penalty: "Muted for 7 days",
    severity: "High",
    createdAt: "2026-03-22T09:30:00.000Z"
  });

  seed.run({
    id: "incident-2",
    recruiter: "ScaleOps Hiring",
    offence: "Listed competitive salary and called that transparency.",
    penalty: "Salary gate failed",
    severity: "Critical",
    createdAt: "2026-03-21T15:00:00.000Z"
  });

  seed.run({
    id: "incident-3",
    recruiter: "CloudNudge",
    offence: "Wanted senior Kubernetes, Go, Rust, and 24/7 on-call for entry level.",
    penalty: "Flagged as unserious",
    severity: "High",
    createdAt: "2026-03-20T11:15:00.000Z"
  });
}

function seedRecruiterQuotes() {
  const seed = db.prepare(`
    INSERT INTO recruiter_quotes (id, quote, source, created_at)
    VALUES (@id, @quote, @source, @createdAt)
  `);

  seed.run({
    id: "quote-1",
    quote: "Do you know Java? I saw you work with JavaScript.",
    source: "Outbound email",
    createdAt: "2026-03-22T10:00:00.000Z"
  });

  seed.run({
    id: "quote-2",
    quote: "We move fast, so the take-home is only six unpaid hours.",
    source: "Intro call",
    createdAt: "2026-03-21T16:20:00.000Z"
  });

  seed.run({
    id: "quote-3",
    quote: "The salary depends on passion.",
    source: "LinkedIn DM",
    createdAt: "2026-03-20T14:10:00.000Z"
  });

  seed.run({
    id: "quote-4",
    quote: "The team uses modern tooling: Excel, WhatsApp, and vibes.",
    source: "Recruiter follow-up",
    createdAt: "2026-03-19T12:00:00.000Z"
  });
}

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

  db.exec(`
    CREATE TABLE IF NOT EXISTS recruiter_incidents (
      id TEXT PRIMARY KEY,
      recruiter TEXT NOT NULL,
      offence TEXT NOT NULL,
      penalty TEXT NOT NULL,
      severity TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS recruiter_quotes (
      id TEXT PRIMARY KEY,
      quote TEXT NOT NULL,
      source TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  if (getCount("applications") === 0) {
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

  if (getCount("recruiter_incidents") === 0) {
    seedRecruiterIncidents();
  }

  if (getCount("recruiter_quotes") === 0) {
    seedRecruiterQuotes();
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

export function createApplicationRecord({ company, role, status }) {
  return insertApplication({
    id: createId("app"),
    company,
    role,
    status,
    createdAt: new Date().toISOString()
  });
}

export function listRecruiterIncidents() {
  return db
    .prepare(`
      SELECT
        id,
        recruiter,
        offence,
        penalty,
        severity,
        created_at AS createdAt
      FROM recruiter_incidents
      ORDER BY datetime(created_at) DESC, rowid DESC
    `)
    .all();
}

export function createRecruiterIncident({ recruiter, offence, penalty, severity }) {
  const id = createId("incident");
  const createdAt = new Date().toISOString();

  db.prepare(`
    INSERT INTO recruiter_incidents (id, recruiter, offence, penalty, severity, created_at)
    VALUES (@id, @recruiter, @offence, @penalty, @severity, @createdAt)
  `).run({
    id,
    recruiter,
    offence,
    penalty,
    severity,
    createdAt
  });

  return db
    .prepare(`
      SELECT
        id,
        recruiter,
        offence,
        penalty,
        severity,
        created_at AS createdAt
      FROM recruiter_incidents
      WHERE id = ?
    `)
    .get(id);
}

export function updateRecruiterIncident(id, updates) {
  const existing = db.prepare("SELECT id FROM recruiter_incidents WHERE id = ?").get(id);

  if (!existing) {
    return null;
  }

  db.prepare(`
    UPDATE recruiter_incidents
    SET recruiter = @recruiter,
        offence = @offence,
        penalty = @penalty,
        severity = @severity
    WHERE id = @id
  `).run({
    id,
    ...updates
  });

  return db
    .prepare(`
      SELECT
        id,
        recruiter,
        offence,
        penalty,
        severity,
        created_at AS createdAt
      FROM recruiter_incidents
      WHERE id = ?
    `)
    .get(id);
}

export function deleteRecruiterIncident(id) {
  const result = db.prepare("DELETE FROM recruiter_incidents WHERE id = ?").run(id);
  return result.changes > 0;
}

export function listRecruiterQuotes() {
  return db
    .prepare(`
      SELECT
        id,
        quote,
        source,
        created_at AS createdAt
      FROM recruiter_quotes
      ORDER BY datetime(created_at) DESC, rowid DESC
    `)
    .all();
}

export function createRecruiterQuote({ quote, source }) {
  const id = createId("quote");
  const createdAt = new Date().toISOString();

  db.prepare(`
    INSERT INTO recruiter_quotes (id, quote, source, created_at)
    VALUES (@id, @quote, @source, @createdAt)
  `).run({
    id,
    quote,
    source,
    createdAt
  });

  return db
    .prepare(`
      SELECT
        id,
        quote,
        source,
        created_at AS createdAt
      FROM recruiter_quotes
      WHERE id = ?
    `)
    .get(id);
}

export function updateRecruiterQuote(id, updates) {
  const existing = db.prepare("SELECT id FROM recruiter_quotes WHERE id = ?").get(id);

  if (!existing) {
    return null;
  }

  db.prepare(`
    UPDATE recruiter_quotes
    SET quote = @quote,
        source = @source
    WHERE id = @id
  `).run({
    id,
    ...updates
  });

  return db
    .prepare(`
      SELECT
        id,
        quote,
        source,
        created_at AS createdAt
      FROM recruiter_quotes
      WHERE id = ?
    `)
    .get(id);
}

export function deleteRecruiterQuote(id) {
  const result = db.prepare("DELETE FROM recruiter_quotes WHERE id = ?").run(id);
  return result.changes > 0;
}

export function getDashboardSummary() {
  return {
    applicationsCount: getCount("applications"),
    incidentsCount: getCount("recruiter_incidents"),
    quotesCount: getCount("recruiter_quotes"),
    latestApplication: db
      .prepare(`
        SELECT company, role, status, created_at AS createdAt
        FROM applications
        ORDER BY datetime(created_at) DESC, rowid DESC
        LIMIT 1
      `)
      .get(),
    latestIncident: db
      .prepare(`
        SELECT recruiter, severity, created_at AS createdAt
        FROM recruiter_incidents
        ORDER BY datetime(created_at) DESC, rowid DESC
        LIMIT 1
      `)
      .get(),
    latestQuote: db
      .prepare(`
        SELECT quote, source, created_at AS createdAt
        FROM recruiter_quotes
        ORDER BY datetime(created_at) DESC, rowid DESC
        LIMIT 1
      `)
      .get()
  };
}
