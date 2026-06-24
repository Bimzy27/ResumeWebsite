<script setup lang="ts">
interface TechItem {
  name: string
  // Simple Icons slug (https://simpleicons.org). Omitted for the handful of
  // brands below with no icon in that set (OpenCode, OpenSpec, XNA) — those
  // fall back to a text monogram instead of a broken image.
  slug?: string
  // Optional hex (no #) to force a specific render color instead of the
  // brand's CDN default. Used for Unity (default color too light to read
  // on white cards) and VS Code (the CDN's default-variant render for this
  // slug was coming back wrong — an unrelated orange icon — so we force
  // VS Code's actual brand blue, which also routes around the bad variant).
  color?: string
  // Short fallback text shown instead of an icon when there's no slug.
  monogram?: string
  // Path (under client/public) to a locally-hosted icon, used instead of the
  // Simple Icons CDN when set. Preferred for brands where the CDN render is
  // wrong/missing, since it doesn't depend on a third-party service at all.
  localIcon?: string
}

// Resolves the actual <img> src for a tech item: a local asset if one was
// supplied, otherwise the Simple Icons CDN (with optional color override).
function iconSrc(tech: TechItem): string {
  if (tech.localIcon) return tech.localIcon
  return `https://cdn.simpleicons.org/${tech.slug}${tech.color ? `/${tech.color}` : ''}`
}

const techStack: TechItem[] = [
  { name: 'C#', slug: 'csharp', localIcon: '/icons/csharp.svg' },
  { name: '.NET', slug: 'dotnet', localIcon: '/icons/dotnet.svg' },
  { name: '.NET Core', localIcon: '/icons/dotnet-core.svg' },
  { name: 'Vue.js', slug: 'vuedotjs' },
  { name: 'TypeScript', slug: 'typescript' },
  { name: 'JavaScript', slug: 'javascript' },
  { name: 'HTML', slug: 'html5' },
  { name: 'CSS', slug: 'css3', localIcon: '/icons/css3.svg' },
  { name: 'Unity', slug: 'unity', color: '000000' },
  { name: 'Git', slug: 'git' },
  { name: 'GitHub', slug: 'github' },
  { name: 'GitHub Actions', slug: 'githubactions' },
  { name: 'Docker', slug: 'docker' },
  { name: 'VS Code', slug: 'visualstudiocode', localIcon: '/icons/visualstudiocode.svg' },
  { name: 'Postman', slug: 'postman' },
  { name: 'Playwright', slug: 'playwright', localIcon: '/icons/playwright.svg' },
  { name: 'Solid.js', slug: 'solid', localIcon: '/icons/solidjs.svg' },
  { name: 'Firebase', slug: 'firebase', localIcon: '/icons/firebase.svg' },
  { name: 'Supabase', slug: 'supabase' },
  { name: 'Vercel', slug: 'vercel' },
  { name: 'Expo', slug: 'expo' },
  { name: 'Omarchy', slug: 'omarchy' },
  { name: 'WezTerm', slug: 'wezterm' },
  { name: 'MySQL', slug: 'mysql' },
  { name: 'Claude Code', slug: 'claude' },
  { name: 'OpenCode', monogram: 'OC' },
  { name: 'OpenSpec', monogram: 'OS' },
  { name: 'Microsoft Office', slug: 'microsoftoffice', localIcon: '/icons/microsoftoffice.svg' },
  { name: 'Copilot Chat', slug: 'githubcopilot' },
  { name: 'XNA', monogram: 'XNA' },
  { name: 'MonoGame', slug: 'monogame' },
  { name: 'Visual Studio', slug: 'visualstudio', localIcon: '/icons/visualstudio.svg' },
  { name: 'Rider', slug: 'rider', localIcon: '/icons/rider.svg' },
  { name: 'PyCharm', slug: 'pycharm', localIcon: '/icons/pycharm.svg' },
  { name: 'Python', slug: 'python', localIcon: '/icons/python.svg' },
  { name: 'Jenkins', slug: 'jenkins', localIcon: '/icons/jenkins.svg' },
  { name: 'npm', slug: 'npm', localIcon: '/icons/npm.svg' },
  { name: 'Ubuntu', slug: 'ubuntu', localIcon: '/icons/ubuntu.svg' },
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
        <div v-for="tech in techStack" :key="tech.name" class="tech-card">
          <img
            v-if="tech.slug || tech.localIcon"
            :src="iconSrc(tech)"
            :alt="tech.name"
            class="tech-card__icon"
            loading="lazy"
          />
          <span v-else class="tech-card__icon tech-card__icon--monogram" aria-hidden="true">{{ tech.monogram }}</span>
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

.tech-card__icon--monogram {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.75rem;
  letter-spacing: 0.02em;
  color: var(--color-text-muted, var(--color-text));
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 50%;
}

.tech-card__name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--color-text);
  text-align: center;
}
</style>
