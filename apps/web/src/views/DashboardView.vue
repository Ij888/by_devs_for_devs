<script setup>
import { onMounted, reactive, ref } from "vue";
import {
  createApplication,
  getApplications,
  getDashboardSummary,
  getRecruiterIncidents,
  getRecruiterQuotes
} from "../services/api.js";

const applications = ref([]);
const shameFeed = ref([]);
const dumpQuotes = ref([]);
const summary = ref({});
const loading = ref(true);
const errorMessage = ref("");
const submitting = ref(false);

const form = reactive({
  company: "",
  role: "",
  status: "Applied"
});

async function loadDashboard() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const [applicationData, incidentData, quoteData, summaryData] = await Promise.all([
      getApplications(),
      getRecruiterIncidents(),
      getRecruiterQuotes(),
      getDashboardSummary()
    ]);

    applications.value = applicationData;
    shameFeed.value = incidentData;
    dumpQuotes.value = quoteData;
    summary.value = summaryData;
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
    summary.value = {
      ...summary.value,
      applicationsCount: applications.value.length,
      latestApplication: created
    };
    form.company = "";
    form.role = "";
    form.status = "Applied";
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    submitting.value = false;
  }
}

onMounted(loadDashboard);
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
          <p v-if="summary.latestQuote" class="dashboard-copy">
            Latest quote source: {{ summary.latestQuote.source }}
          </p>
        </div>

        <div class="dashboard-metrics" aria-label="Platform metrics">
          <article class="metric-card">
            <span>Open applications</span>
            <strong>{{ summary.applicationsCount ?? applications.length }}</strong>
          </article>
          <article class="metric-card">
            <span>Wall entries</span>
            <strong>{{ summary.incidentsCount ?? shameFeed.length }}</strong>
          </article>
          <article class="metric-card metric-card-alert">
            <span>Recruiter nonsense</span>
            <strong>{{ summary.quotesCount ?? dumpQuotes.length }}</strong>
          </article>
        </div>
      </header>

      <p v-if="errorMessage" class="status-message status-error">{{ errorMessage }}</p>

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

          <p v-if="loading" class="status-message">Loading applications...</p>

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
            <li v-for="entry in shameFeed" :key="entry.id" class="shame-feed-item">
              <div class="shame-feed-header">
                <h3>{{ entry.recruiter }}</h3>
                <span class="severity-pill">{{ entry.severity }}</span>
              </div>
              <p>{{ entry.offence }}</p>
              <p class="application-date">{{ entry.penalty }}</p>
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
            <article v-for="quote in dumpQuotes" :key="quote.id" class="dump-card">
              <p>"{{ quote.quote }}"</p>
              <p class="application-date">{{ quote.source }}</p>
            </article>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>
