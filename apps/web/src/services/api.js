const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export async function getHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) throw new Error("Health check failed");
  return response.json();
}

async function parseJsonResponse(response, fallbackMessage) {
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || fallbackMessage);
  }

  const payload = await response.json();
  return payload.data;
}

export async function getApplications() {
  const response = await fetch(`${API_BASE_URL}/applications`);
  return (await parseJsonResponse(response, "Failed to load applications")) ?? [];
}

export async function createApplication(application) {
  const response = await fetch(`${API_BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(application)
  });

  return parseJsonResponse(response, "Failed to create application");
}

export async function getRecruiterIncidents() {
  const response = await fetch(`${API_BASE_URL}/recruiter-incidents`);
  return (await parseJsonResponse(response, "Failed to load recruiter incidents")) ?? [];
}

export async function getRecruiterQuotes() {
  const response = await fetch(`${API_BASE_URL}/recruiter-quotes`);
  return (await parseJsonResponse(response, "Failed to load recruiter quotes")) ?? [];
}

export async function getDashboardSummary() {
  const response = await fetch(`${API_BASE_URL}/dashboard/summary`);
  return (await parseJsonResponse(response, "Failed to load dashboard summary")) ?? {};
}
