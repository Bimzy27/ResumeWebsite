<script setup lang="ts">
import { reactive, ref } from 'vue'
import { postContact, useApiResource } from '../composables/useApi'
import { fallbackProfile } from '../data/fallback'
import type { Profile } from '../types'

const { data: profile } = useApiResource<Profile>('/profile', fallbackProfile)

const form = reactive({ name: '', email: '', message: '' })
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const statusMessage = ref('')

async function onSubmit() {
  status.value = 'sending'
  try {
    const result = await postContact({ ...form })
    status.value = result.success ? 'sent' : 'error'
    statusMessage.value = result.message
    if (result.success) {
      form.name = ''
      form.email = ''
      form.message = ''
    }
  } catch {
    status.value = 'error'
    statusMessage.value = "Something went wrong sending that — please email me directly instead."
  }
}
</script>

<template>
  <section id="contact">
    <div class="container contact">
      <div>
        <p class="section-eyebrow">Contact</p>
        <h2 class="section-title">Let's work together</h2>
        <p class="section-intro">
          Looking for a full-stack engineer who can move comfortably between Vue and .NET? I'd
          love to hear about what you're building.
        </p>
        <ul class="contact__details">
          <li>
            <strong>Email</strong>
            <a :href="`mailto:${profile.contact.email}`">{{ profile.contact.email }}</a>
          </li>
          <li>
            <strong>Phone</strong>
            <span>{{ profile.contact.phone }}</span>
          </li>
          <li>
            <strong>Location</strong>
            <span>{{ profile.contact.location }}</span>
          </li>
          <li>
            <strong>LinkedIn</strong>
            <a :href="profile.contact.linkedIn" target="_blank" rel="noopener">View profile</a>
          </li>
        </ul>
      </div>

      <form class="contact__form" @submit.prevent="onSubmit">
        <label>
          Name
          <input v-model="form.name" type="text" name="name" required />
        </label>
        <label>
          Email
          <input v-model="form.email" type="email" name="email" required />
        </label>
        <label>
          Message
          <textarea v-model="form.message" name="message" rows="4" required></textarea>
        </label>
        <button type="submit" class="btn btn-primary" :disabled="status === 'sending'">
          {{ status === 'sending' ? 'Sending…' : 'Send message' }}
        </button>
        <p v-if="status === 'sent'" class="contact__status contact__status--ok">{{ statusMessage }}</p>
        <p v-if="status === 'error'" class="contact__status contact__status--error">{{ statusMessage }}</p>
      </form>
    </div>
  </section>
</template>

<style scoped>
.contact {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
}

.contact__details {
  list-style: none;
  padding: 0;
  margin: 32px 0 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact__details li {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.contact__details strong {
  font-family: var(--font-display);
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-primary);
}

.contact__details a,
.contact__details span {
  color: var(--color-text);
  text-decoration: none;
}

.contact__form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 32px;
}

.contact__form label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: 500;
  font-size: 0.9rem;
}

.contact__form input,
.contact__form textarea {
  font-family: var(--font-body);
  font-size: 0.95rem;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  resize: vertical;
}

.contact__form input:focus,
.contact__form textarea:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 1px;
}

.contact__form button {
  align-self: flex-start;
}

.contact__form button:disabled {
  opacity: 0.7;
  cursor: progress;
}

.contact__status {
  font-size: 0.9rem;
  margin: 0;
}

.contact__status--ok {
  color: var(--color-vue);
}

.contact__status--error {
  color: var(--color-accent);
}

@media (max-width: 768px) {
  .contact {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
</style>
