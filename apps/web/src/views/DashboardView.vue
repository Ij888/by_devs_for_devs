<script setup>
import { onMounted, reactive, ref } from "vue";
import {
  createApplication,
  createRecruiterIncident,
  createRecruiterQuote,
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
const applicationSubmitting = ref(false);
const incidentSubmitting = ref(false);
const quoteSubmitting = ref(false);

const applicationForm = reactive({
  company: "",
  role: "",
  status: "Applied"
});

const incidentForm = reactive({
  recruiter: "",
  offence: "",
  penalty: "",
  severity: "High"
});

const quoteForm = reactive({
  quote: "",
  source: ""
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

function refreshSummary(partial) {
  summary.value = {
    ...summary.value,
    ...partial
  };
}

async function handleApplicationSubmit() {
  applicationSubmitting.value = true;
  errorMessage.value = "";

  try {
    const created = await createApplication({
      company: applicationForm.company,
      role: applicationForm.role,
      status: applicationForm.status
    });

    applications.value = [created, ...applications.value];
    refreshSummary({
      applicationsCount: applications.value.length,
      latestApplication: created
    });
    applicationForm.company = "";
    applicationForm.role = "";
    applicationForm.status = "Applied";
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    applicationSubmitting.value = false;
  }
}

async function handleIncidentSubmit() {
  incidentSubmitting.value = true;
  errorMessage.value = "";

  try {
    const created = await createRecruiterIncident({
      recruiter: incidentForm.recruiter,
      offence: incidentForm.offence,
      penalty: incidentForm.penalty,
      severity: incidentForm.severity
    });

    shameFeed.value = [created, ...shameFeed.value];
    refreshSummary({
      incidentsCount: shameFeed.value.length,
      latestIncident: created
    });
    incidentForm.recruiter = "";
    incidentForm.offence = "";
    incidentForm.penalty = "";
    incidentForm.severity = "High";
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    incidentSubmitting.value = false;
  }
}

async function handleQuoteSubmit() {
  quoteSubmitting.value = true;
  errorMessage.value = "";

  try {
    const created = await createRecruiterQuote({
      quote: quoteForm.quote,
      source: quoteForm.source
    });

    dumpQuotes.value = [created, ...dumpQuotes.value];
    refreshSummary({
      quotesCount: dumpQuotes.value.length,
      latestQuote: created
    });
    quoteForm.quote = "";
    quoteForm.source = "";
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    quoteSubmitting.value = false;
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

          <form class="application-form" @submit.prevent="handleApplicationSubmit">
            <label class="field">
              <span>Company</span>
              <input v-model.trim="applicationForm.company" type="text" required />
            </label>

            <label class="field">
              <span>Role</span>
              <input v-model.trim="applicationForm.role" type="text" required />
            </label>

            <label class="field">
              <span>Status</span>
              <select v-model="applicationForm.status">
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </label>

            <button class="button button-primary" type="submit" :disabled="applicationSubmitting">
              {{ applicationSubmitting ? "Saving..." : "Add application" }}
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

          <form class="stacked-form" @submit.prevent="handleIncidentSubmit">
            <label class="field">
              <span>Recruiter</span>
              <input v-model.trim="incidentForm.recruiter" type="text" required />
            </label>

            <label class="field">
              <span>Offence</span>
              <textarea v-model.trim="incidentForm.offence" rows="3" required />
            </label>

            <label class="field">
              <span>Penalty</span>
              <input v-model.trim="incidentForm.penalty" type="text" required />
            </label>

            <label class="field">
              <span>Severity</span>
              <select v-model="incidentForm.severity">
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </label>

            <button class="button button-secondary" type="submit" :disabled="incidentSubmitting">
              {{ incidentSubmitting ? "Saving..." : "Add wall entry" }}
            </button>
          </form>

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

          <form class="stacked-form stacked-form-inline" @submit.prevent="handleQuoteSubmit">
            <label class="field field-grow">
              <span>Quote</span>
              <textarea v-model.trim="quoteForm.quote" rows="3" required />
            </label>

            <label class="field">
              <span>Source</span>
              <input v-model.trim="quoteForm.source" type="text" required />
            </label>

            <button class="button button-secondary" type="submit" :disabled="quoteSubmitting">
              {{ quoteSubmitting ? "Saving..." : "Add quote" }}
            </button>
          </form>

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
