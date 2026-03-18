<template>
  <main class="home-page">
    <section class="hero">
      <p class="eyebrow">byDevsforDevs</p>
      <h1>Track job applications with a clean pipeline workflow</h1>
      <p class="hero-copy">
        A lightweight app for developers to manage pipelines and applications
        in one place.
      </p>
      <div class="hero-actions">
        <RouterLink to="/dashboard" class="button button-primary">
          Go to Dashboard
        </RouterLink>
        <a href="#features" class="button button-secondary">View Features</a>
      </div>
    </section>

    <section id="features" class="feature-grid" aria-label="Key features">
      <article class="feature-card">
        <h2>Pipelines</h2>
        <p>Create collections for different job search tracks.</p>
      </article>
      <article class="feature-card">
        <h2>Applications</h2>
        <p>Track status, notes, and next steps for each application.</p>
      </article>
      <article class="feature-card">
        <h2>Public Feed</h2>
        <p>Expose sanitized application records through a public endpoint.</p>
      </article>
    </section>
  </main>
</template>
