<script setup>
import { onMounted, reactive, ref } from "vue";
import { createApplication, getApplications } from "../services/api.js";

const shameFeed = [
  {
    name: "Nebula Talent",
    issue: "Asked for a senior engineer and offered 'great exposure' instead of a range.",
    severity: "Critical"
  },
  {
    name: "Quantum Recruit",
    issue: "Sent the same Rust role to three frontend developers in one hour.",
    severity: "High"
  },
  {
    name: "StackSource",
    issue: "Introduced a take-home after claiming the process was 'just one chat'.",
    severity: "Medium"
  }
];

const dumpQuotes = [
  "We love your background in React, would you relocate tomorrow for a PHP support role?",
  "The client wants a startup mindset, enterprise reliability, and intern-level budget.",
  "There is no salary band yet, but the mission is priceless.",
  "Could you just rewrite your CV to sound more senior without changing your experience?"
];

const applications = ref([]);
const loading = ref(true);
const errorMessage = ref("");
const submitting = ref(false);

const form = reactive({
  company: "",
  role: "",
  status: "Applied"
});

async function loadApplications() {
  loading.value = true;
  errorMessage.value = "";

  try {
    applications.value = await getApplications();
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
}

async function handleSubmit() {
  submitting.value = true;
  errorMessage.value = "";

  try {
    const created = await createApplication({
      company: form.company,
      role: form.role,
      status: form.status
    });

    applications.value = [created, ...applications.value];
    form.company = "";
    form.role = "";
    form.status = "Applied";
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    submitting.value = false;
  }
}

onMounted(loadApplications);
</script>

<template>
  <main class="dashboard-page">
    <section class="dashboard-shell">
      <header class="dashboard-hero">
        <div>
          <p class="eyebrow">Control Room</p>
          <h1>Developer-first hiring dashboard</h1>
          <p class="dashboard-copy">
            Track applications, monitor recruiter behaviour, and keep a running archive of
            the nonsense that proves this platform needs to exist.
          </p>
        </div>

        <div class="dashboard-metrics" aria-label="Platform metrics">
          <article class="metric-card">
            <span>Open applications</span>
            <strong>{{ applications.length }}</strong>
          </article>
          <article class="metric-card">
            <span>Wall entries</span>
            <strong>{{ shameFeed.length }}</strong>
          </article>
          <article class="metric-card metric-card-alert">
            <span>Recruiter nonsense</span>
            <strong>{{ dumpQuotes.length }}</strong>
          </article>
        </div>
      </header>

      <div class="dashboard-grid">
        <section class="dashboard-panel dashboard-panel-wide">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Applications</p>
              <h2>Pipeline tracker</h2>
            </div>
          </div>

          <form class="application-form" @submit.prevent="handleSubmit">
            <label class="field">
              <span>Company</span>
              <input v-model.trim="form.company" type="text" required />
            </label>

            <label class="field">
              <span>Role</span>
              <input v-model.trim="form.role" type="text" required />
            </label>

            <label class="field">
              <span>Status</span>
              <select v-model="form.status">
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </label>

            <button class="button button-primary" type="submit" :disabled="submitting">
              {{ submitting ? "Saving..." : "Add application" }}
            </button>
          </form>

          <p v-if="errorMessage" class="status-message status-error">{{ errorMessage }}</p>
          <p v-else-if="loading" class="status-message">Loading applications...</p>

          <ul v-else class="application-list">
            <li v-for="application in applications" :key="application.id" class="application-card">
              <div class="application-card-header">
                <h3>{{ application.company }}</h3>
                <span class="application-status">{{ application.status }}</span>
              </div>
              <p class="application-role">{{ application.role }}</p>
              <p class="application-date">
                Added {{ new Date(application.createdAt).toLocaleString() }}
              </p>
            </li>
          </ul>
        </section>

        <section class="dashboard-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Wall Of Shame</p>
              <h2>Flagged recruiters</h2>
            </div>
          </div>

          <ul class="shame-feed">
            <li v-for="entry in shameFeed" :key="entry.name" class="shame-feed-item">
              <div class="shame-feed-header">
                <h3>{{ entry.name }}</h3>
                <span class="severity-pill">{{ entry.severity }}</span>
              </div>
              <p>{{ entry.issue }}</p>
            </li>
          </ul>
        </section>

        <section class="dashboard-panel dashboard-panel-wide">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Dump Things Recruiters Say</p>
              <h2>Archive of avoidable nonsense</h2>
            </div>
          </div>

          <div class="dump-grid">
            <article v-for="quote in dumpQuotes" :key="quote" class="dump-card">
              <p>“{{ quote }}”</p>
            </article>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>
