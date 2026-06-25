<script setup lang="ts">
import { computed, ref } from 'vue'
import { useApiResource } from '../composables/useApi'
import { fallbackProfile } from '../data/fallback'
import type { Profile } from '../types'

const { data: profile } = useApiResource<Profile>('/profile', fallbackProfile)

// Public-folder path for the headshot. Bound (not a static src) on purpose: a
// static src="/..." makes Vite try to resolve it as a module import at build
// time and fail if the file is absent — a runtime binding just serves it from
// /public when present. Until then the @error handler shows an initials avatar.
const photoUrl = '/profile-photo.jpg'
const avatarFailed = ref(false)
const initials = computed(() =>
  profile.value.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase(),
)
</script>

<template>
  <section id="contact">
    <div class="container contact">
      <div class="contact__intro">
        <p class="section-eyebrow">Contact</p>
        <h2 class="section-title">Let's work together</h2>
        <p class="section-intro">
          Looking for a full-stack engineer who can move comfortably between Vue and .NET? I'd
          love to hear about what you're building.
        </p>
      </div>

      <div class="contact__connect">
          <div class="contact__social">
            <img
              v-if="!avatarFailed"
              class="contact__avatar"
              :src="photoUrl"
              :alt="profile.name"
              width="76"
              height="76"
              @error="avatarFailed = true"
            />
            <span v-else class="contact__avatar contact__avatar--fallback" :aria-label="profile.name">{{ initials }}</span>
            <a
              :href="profile.contact.linkedIn"
              target="_blank"
              rel="noopener"
              class="icon-btn icon-btn--linkedin"
              aria-label="LinkedIn profile"
              title="LinkedIn"
            >
              <svg class="icon-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"
                />
              </svg>
              <span class="icon-btn__label">LinkedIn</span>
            </a>

            <a
              href="https://github.com/Bimzy27"
              target="_blank"
              rel="noopener"
              class="icon-btn icon-btn--github"
              aria-label="GitHub profile"
              title="GitHub"
            >
              <svg class="icon-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.29 0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z"
                />
              </svg>
              <span class="icon-btn__label">GitHub</span>
            </a>

            <a
              href="https://leetcode.com/u/Bimzy27/"
              target="_blank"
              rel="noopener"
              class="icon-btn icon-btn--leetcode"
              aria-label="LeetCode profile"
              title="LeetCode"
            >
              <svg class="icon-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M13.48 0a1.37 1.37 0 0 0-.96.4L7.4 5.6 3.45 9.55a3.7 3.7 0 0 0 0 5.23l4.04 4.04a3.7 3.7 0 0 0 5.23 0l2.78-2.78a1.37 1.37 0 0 0-1.94-1.94l-2.78 2.78a.96.96 0 0 1-1.36 0l-4.04-4.04a.96.96 0 0 1 0-1.36l3.95-3.95 5.12-5.2A1.37 1.37 0 0 0 13.48 0z"
                />
                <path
                  fill="currentColor"
                  d="M21.13 10.42h-8.2a1.37 1.37 0 1 0 0 2.74h8.2a1.37 1.37 0 0 0 0-2.74z"
                />
              </svg>
              <span class="icon-btn__label">LeetCode</span>
            </a>

            <a
              href="https://www.youtube.com/@BimzyDev"
              target="_blank"
              rel="noopener"
              class="icon-btn icon-btn--youtube"
              aria-label="YouTube channel"
              title="YouTube"
            >
              <svg class="icon-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.92.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.8zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"
                />
              </svg>
              <span class="icon-btn__label">YouTube</span>
            </a>

            <a
              href="/Branden-Immerzeel-Resume.pdf"
              target="_blank"
              rel="noopener"
              class="resume-btn"
              aria-label="Download resume (PDF)"
            >
              <svg
                class="resume-btn__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <polyline points="9 15 12 18 15 15" />
              </svg>
              <span>Resume</span>
            </a>
          </div>
        </div>

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
        </ul>
    </div>
  </section>
</template>

<style scoped>
.contact__intro {
  max-width: 680px;
}

.contact__connect {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
  margin-top: 28px;
}

.contact__avatar {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-surface);
  background: var(--color-surface);
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.18);
  flex: 0 0 auto;
}

.contact__avatar--fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.5rem;
  color: #fff;
  background: var(--gradient-hero);
}

.contact__social {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: nowrap;
}

/* Let the buttons wrap only when the viewport is too narrow to fit them. */
@media (max-width: 768px) {
  .contact__social {
    flex-wrap: wrap;
  }
}

/* Labeled social buttons, each filled with its own brand color so the platform
   is recognizable at a glance. */
.icon-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid transparent;
  color: #fff;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1;
  text-decoration: none;
  transition:
    transform 0.16s ease,
    filter 0.16s ease,
    box-shadow 0.16s ease;
}

.icon-btn__icon {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
}

.icon-btn:hover,
.icon-btn:focus-visible {
  transform: translateY(-2px);
  filter: brightness(1.06);
}

.icon-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.icon-btn--linkedin {
  background: #0a66c2;
  box-shadow: 0 6px 14px rgba(10, 102, 194, 0.28);
}

.icon-btn--github {
  background: #1b1f24;
  box-shadow: 0 6px 14px rgba(27, 31, 36, 0.28);
}

.icon-btn--leetcode {
  background: #ffa116;
  color: #1a1a1a;
  box-shadow: 0 6px 14px rgba(255, 161, 22, 0.3);
}

.icon-btn--youtube {
  background: #ff0000;
  box-shadow: 0 6px 14px rgba(255, 0, 0, 0.28);
}

/* The single emphasized call-to-action in the icon row. */
.resume-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 18px;
  border-radius: 12px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1;
  color: #fff;
  text-decoration: none;
  background: var(--color-primary);
  box-shadow: 0 6px 16px rgba(124, 58, 237, 0.3);
  transition:
    transform 0.16s ease,
    filter 0.16s ease;
}

.resume-btn__icon {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
}

.resume-btn:hover,
.resume-btn:focus-visible {
  transform: translateY(-2px);
  filter: brightness(1.05);
}

.resume-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.contact__details {
  list-style: none;
  padding: 0;
  margin: 32px 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
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

.contact__details a:hover {
  color: var(--color-primary);
}
</style>
