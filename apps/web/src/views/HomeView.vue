<script setup>
import { onMounted, ref } from "vue";
import { getDashboardSummary, getRecruiterIncidents, getRecruiterQuotes } from "../services/api.js";

const manifesto = [
  "Built for frontend, backend, and full-stack engineers.",
  "Open to contractors, self-taught developers, and nontraditional builders.",
  "Shipped work matters more than keyword theatre.",
  "Recruiters only get through with specifics."
];

const wallEntries = ref([]);
const recruiterQuotes = ref([]);
const summary = ref({});
const loading = ref(true);
const errorMessage = ref("");

async function loadHomeData() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const [summaryData, incidents, quotes] = await Promise.all([
      getDashboardSummary(),
      getRecruiterIncidents(),
      getRecruiterQuotes()
    ]);

    summary.value = summaryData;
    wallEntries.value = incidents.slice(0, 3);
    recruiterQuotes.value = quotes.slice(0, 5);
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
}

onMounted(loadHomeData);
</script>

<template>
  <main class="home-page">
    <section class="home-hero">
      <div class="hero-copy-block">
        <p class="eyebrow">byDevsforDevs</p>
        <h1>Hiring infrastructure for engineers and builders with real shipped work.</h1>
        <p class="hero-copy">
          Built for frontend, backend, and full-stack engineers, plus contractors,
          self-taught developers, and technical builders who want clear terms and credible
          outreach.
        </p>

        <div class="hero-ribbon" aria-label="Hero highlights">
          <span>For engineers with shipped work</span>
          <span>For contractors and nontraditional devs</span>
          <span>For people who want clear technical roles</span>
        </div>

        <div class="hero-actions">
          <RouterLink to="/dashboard" class="button button-primary">
            Open Dashboard
          </RouterLink>
          <a href="#wall" class="button button-secondary">See the wall</a>
        </div>

        <ul class="manifesto-list" aria-label="Platform rules">
          <li v-for="item in manifesto" :key="item">{{ item }}</li>
        </ul>
      </div>

      <aside class="hero-signal-board" aria-label="Live platform signals">
        <div class="signal-card">
          <span class="signal-label">Applications tracked</span>
          <strong>{{ summary.applicationsCount ?? 0 }}</strong>
          <p>
            {{
              summary.latestApplication
                ? `${summary.latestApplication.company} is the latest pipeline entry.`
                : "Waiting for the first application to land."
            }}
          </p>
        </div>
        <div class="signal-card">
          <span class="signal-label">Wall entries</span>
          <strong>{{ summary.incidentsCount ?? 0 }}</strong>
          <p>
            {{
              summary.latestIncident
                ? `${summary.latestIncident.recruiter} was the latest recruiter to get flagged.`
                : "No recruiter incidents recorded yet."
            }}
          </p>
        </div>
        <div class="signal-card signal-card-accent">
          <span class="signal-label">Quote archive</span>
          <strong>{{ summary.quotesCount ?? 0 }}</strong>
          <p>
            {{
              summary.latestQuote
                ? `${summary.latestQuote.source} supplied the latest nonsense.`
                : "The archive is empty. Suspicious."
            }}
          </p>
        </div>
      </aside>
    </section>

    <p v-if="errorMessage" class="status-message status-error">{{ errorMessage }}</p>
    <p v-else-if="loading" class="status-message">Loading wall of shame data...</p>

    <section class="feature-grid" aria-label="Platform features">
      <article class="feature-card feature-card-strong">
        <h2>Reverse Interview</h2>
        <p>
          Recruiters apply to talk to experienced engineers and builders. Salary, stack,
          process, and intent are required up front.
        </p>
      </article>

      <article class="feature-card">
        <h2>Proof of Skill</h2>
        <p>
          Profiles are built around shipped work, active repos, and technical signals instead
          of pedigree theatre.
        </p>
      </article>

      <article class="feature-card">
        <h2>Bullshit Filter</h2>
        <p>
          Vague salary, weak role definitions, and low-effort recruiter outreach get flagged
          before they waste an engineer's time.
        </p>
      </article>
    </section>

    <section id="wall" class="shame-section">
      <div class="section-heading">
        <p class="eyebrow">Recruiter Wall Of Shame</p>
        <h2>Public reminders that low-signal outreach has a cost.</h2>
      </div>

      <div class="shame-grid">
        <article v-for="entry in wallEntries" :key="entry.id" class="shame-card">
          <span class="shame-badge">{{ entry.severity }}</span>
          <h3>{{ entry.recruiter }}</h3>
          <p>{{ entry.offence }}</p>
          <strong>{{ entry.penalty }}</strong>
        </article>
      </div>
    </section>

    <section class="quote-section">
      <div class="section-heading">
        <p class="eyebrow">Recruiter Quotes</p>
        <h2>Collected from conversations engineers should not have had to endure.</h2>
      </div>

      <div class="quote-list" aria-label="Recruiter quote list">
        <blockquote v-for="quote in recruiterQuotes" :key="quote.id" class="quote-card">
          "{{ quote.quote }}"
        </blockquote>
      </div>
    </section>
  </main>
</template>
