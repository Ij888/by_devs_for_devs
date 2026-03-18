<script setup>
import { onMounted, reactive, ref } from "vue";
import { createApplication, getApplications } from "../services/api.js";

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
    <section class="dashboard-panel">
      <p class="eyebrow">Dashboard</p>
      <h1>Applications</h1>
      <p class="dashboard-copy">
        Fetch existing applications and add a new one through the Express API.
      </p>

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
            <h2>{{ application.company }}</h2>
            <span class="application-status">{{ application.status }}</span>
          </div>
          <p class="application-role">{{ application.role }}</p>
          <p class="application-date">
            Added {{ new Date(application.createdAt).toLocaleString() }}
          </p>
        </li>
      </ul>
    </section>
  </main>
</template>
