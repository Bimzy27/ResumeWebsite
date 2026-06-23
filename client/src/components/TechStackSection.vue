<script setup lang="ts">
interface TechItem {
  name: string
  slug: string
  // Optional hex (no #) to force a specific render color instead of the
  // brand's CDN default — used for Unity below, whose default icon color
  // is too light to read against this section's white cards.
  color?: string
}

const techStack: TechItem[] = [
  { name: 'C#', slug: 'csharp' },
  { name: '.NET', slug: 'dotnet' },
  { name: 'Vue.js', slug: 'vuedotjs' },
  { name: 'TypeScript', slug: 'typescript' },
  { name: 'JavaScript', slug: 'javascript' },
  { name: 'HTML', slug: 'html5' },
  { name: 'CSS', slug: 'css3' },
  { name: 'Unity', slug: 'unity', color: '000000' },
  { name: 'Git', slug: 'git' },
  { name: 'GitHub', slug: 'github' },
  { name: 'GitHub Actions', slug: 'githubactions' },
  { name: 'Docker', slug: 'docker' },
  { name: 'VS Code', slug: 'visualstudiocode' },
  { name: 'Postman', slug: 'postman' },
  { name: 'Playwright', slug: 'playwright' },
]
</script>

<template>
  <section id="tech-stack">
    <div class="container">
      <p class="section-eyebrow">Tech Stack</p>
      <h2 class="section-title">Tools &amp; technologies I work with</h2>
      <p class="section-intro">
        The languages, frameworks, and tooling I reach for across full-stack web and game
        development.
      </p>

      <div class="tech-grid">
        <div v-for="tech in techStack" :key="tech.slug" class="tech-card">
          <img
            :src="`https://cdn.simpleicons.org/${tech.slug}${tech.color ? `/${tech.color}` : ''}`"
            :alt="tech.name"
            class="tech-card__icon"
            loading="lazy"
          />
          <span class="tech-card__name">{{ tech.name }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 16px;
  margin-top: 40px;
}

.tech-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px 12px;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}

.tech-card:hover {
  transform: translateY(-4px) scale(1.06);
  border-color: var(--color-primary);
  box-shadow: 0 12px 28px rgba(124, 58, 237, 0.22);
}

.tech-card__icon {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.tech-card__name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--color-text);
  text-align: center;
}
</style>
