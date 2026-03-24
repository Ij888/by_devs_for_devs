<template>
  <div class="app-shell">
    <header class="site-header">
      <RouterLink to="/" class="site-brand" aria-label="byDevsforDevs home">
        <span class="brand-mark">B</span>
        <span class="brand-copy">
          <strong>byDevsforDevs</strong>
          <small>Recruiter filtering for people who can read stack traces</small>
        </span>
      </RouterLink>

      <nav class="site-nav" aria-label="Primary">
        <RouterLink to="/" class="site-nav-link">Home</RouterLink>
        <RouterLink to="/dashboard" class="site-nav-link">Dashboard</RouterLink>
        <a href="#/dashboard" class="site-nav-link">Wall of Shame</a>
      </nav>
    </header>

    <router-view />

    <footer class="site-footer">
      <div>
        <p class="site-footer-title">byDevsforDevs</p>
        <p class="site-footer-copy">
          Built for developers who are tired of vague outreach, missing salary bands, and
          process theatre.
        </p>
      </div>

      <div class="site-footer-meta">
        <span>Proof of work over keyword theatre.</span>
        <span>No ghosting. No fluff. No mystery boxes.</span>
      </div>
    </footer>
  </div>
</template>
