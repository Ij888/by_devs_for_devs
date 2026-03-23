<script setup>
const wallEntries = [
  {
    recruiter: "TalentRocket",
    offence: "Sent a 'personalised' message that still had [FirstName] in it.",
    penalty: "Muted for 7 days"
  },
  {
    recruiter: "ScaleOps Hiring",
    offence: "Listed 'competitive salary' and called that transparency.",
    penalty: "Salary gate failed"
  },
  {
    recruiter: "CloudNudge",
    offence: "Wanted senior Kubernetes, Go, Rust, and 24/7 on-call for 'entry level'.",
    penalty: "Flagged as unserious"
  }
];

const recruiterQuotes = [
  "Do you know Java? I saw you work with JavaScript.",
  "We move fast, so the take-home is only six unpaid hours.",
  "The salary depends on passion.",
  "Can you send your CV in PDF, Word, and as a Loom explaining your aura?",
  "The team uses modern tooling: Excel, WhatsApp, and vibes."
];

const manifesto = [
  "No ghosting disguised as process.",
  "No recruiter access without specifics.",
  "No salary mystery boxes.",
  "No pretending a copy-paste message is outreach."
];
</script>

<template>
  <main class="home-page">
    <section class="home-hero">
      <div class="hero-copy-block">
        <p class="eyebrow">byDevsforDevs</p>
        <h1>Recruiting infrastructure for developers with standards.</h1>
        <p class="hero-copy">
          A job platform that treats proof of work as proof of work. Developers set the
          terms. Recruiters submit details or get filtered out.
        </p>

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
          <span class="signal-label">Ghosting Rate</span>
          <strong>Down 38%</strong>
          <p>Timeout rules and structured submissions are doing their job.</p>
        </div>
        <div class="signal-card">
          <span class="signal-label">Bad Outreach Blocked</span>
          <strong>214 this month</strong>
          <p>Generic recruiter spam now dies before it reaches a developer inbox.</p>
        </div>
        <div class="signal-card signal-card-accent">
          <span class="signal-label">Current Mode</span>
          <strong>Shutdown Available</strong>
          <p>When developers are offline, the message button disappears. As it should.</p>
        </div>
      </aside>
    </section>

    <section class="feature-grid" aria-label="Platform features">
      <article class="feature-card feature-card-strong">
        <h2>Reverse Interview</h2>
        <p>
          Recruiters apply to talk to the developer. Salary, stack, process, and intent are
          required up front.
        </p>
      </article>

      <article class="feature-card">
        <h2>Proof of Skill</h2>
        <p>
          Profiles are built around shipped work, active repos, and technical signals instead
          of keyword theatre.
        </p>
      </article>

      <article class="feature-card">
        <h2>Bullshit Filter</h2>
        <p>
          Vague salary, absurd requirements, and recruiter nonsense get flagged before they
          waste anyone's time.
        </p>
      </article>
    </section>

    <section id="wall" class="shame-section">
      <div class="section-heading">
        <p class="eyebrow">Recruiter Wall Of Shame</p>
        <h2>Public reminders that low-effort outreach has a cost.</h2>
      </div>

      <div class="shame-grid">
        <article v-for="entry in wallEntries" :key="entry.recruiter" class="shame-card">
          <span class="shame-badge">Flagged</span>
          <h3>{{ entry.recruiter }}</h3>
          <p>{{ entry.offence }}</p>
          <strong>{{ entry.penalty }}</strong>
        </article>
      </div>
    </section>

    <section class="quote-section">
      <div class="section-heading">
        <p class="eyebrow">Dump Things Recruiters Say</p>
        <h2>Collected from the digital landfill.</h2>
      </div>

      <div class="quote-list" aria-label="Recruiter quote list">
        <blockquote v-for="quote in recruiterQuotes" :key="quote" class="quote-card">
          "{{ quote }}"
        </blockquote>
      </div>
    </section>
  </main>
</template>
