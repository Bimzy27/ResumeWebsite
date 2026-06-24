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
  // Link to the tool's official documentation. Each card is rendered as a
  // link that opens this in a new tab.
  docsUrl: string
}

// Resolves the actual <img> src for a tech item: a local asset if one was
// supplied, otherwise the Simple Icons CDN (with optional color override).
function iconSrc(tech: TechItem): string {
  if (tech.localIcon) return tech.localIcon
  return `https://cdn.simpleicons.org/${tech.slug}${tech.color ? `/${tech.color}` : ''}`
}

const techStack: TechItem[] = [
  { name: 'C#', slug: 'csharp', localIcon: '/icons/csharp.svg', docsUrl: 'https://learn.microsoft.com/en-us/dotnet/csharp/' },
  { name: '.NET', slug: 'dotnet', localIcon: '/icons/dotnet.svg', docsUrl: 'https://learn.microsoft.com/en-us/dotnet/' },
  { name: '.NET Core', localIcon: '/icons/dotnet-core.svg', docsUrl: 'https://learn.microsoft.com/en-us/dotnet/core/introduction' },
  { name: 'Vue.js', slug: 'vuedotjs', docsUrl: 'https://vuejs.org/guide/introduction.html' },
  { name: 'TypeScript', slug: 'typescript', docsUrl: 'https://www.typescriptlang.org/docs/' },
  { name: 'JavaScript', slug: 'javascript', docsUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  { name: 'HTML', slug: 'html5', docsUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
  { name: 'CSS', slug: 'css3', localIcon: '/icons/css3.svg', docsUrl: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
  { name: 'Unity', slug: 'unity', color: '000000', docsUrl: 'https://docs.unity3d.com/' },
  { name: 'Git', slug: 'git', docsUrl: 'https://git-scm.com/doc' },
  { name: 'GitHub', slug: 'github', docsUrl: 'https://docs.github.com/' },
  { name: 'GitHub Actions', slug: 'githubactions', docsUrl: 'https://docs.github.com/en/actions' },
  { name: 'Docker', slug: 'docker', docsUrl: 'https://docs.docker.com/' },
  { name: 'VS Code', slug: 'visualstudiocode', localIcon: '/icons/visualstudiocode.svg', docsUrl: 'https://code.visualstudio.com/docs' },
  { name: 'Postman', slug: 'postman', docsUrl: 'https://learning.postman.com/docs/getting-started/overview/' },
  { name: 'Playwright', slug: 'playwright', localIcon: '/icons/playwright.svg', docsUrl: 'https://playwright.dev/docs/intro' },
  { name: 'Solid.js', slug: 'solid', localIcon: '/icons/solidjs.svg', docsUrl: 'https://www.solidjs.com/docs/latest' },
  { name: 'Firebase', slug: 'firebase', localIcon: '/icons/firebase.svg', docsUrl: 'https://firebase.google.com/docs' },
  { name: 'Supabase', slug: 'supabase', docsUrl: 'https://supabase.com/docs' },
  { name: 'Vercel', slug: 'vercel', docsUrl: 'https://vercel.com/docs' },
  { name: 'Expo', slug: 'expo', docsUrl: 'https://docs.expo.dev/' },
  { name: 'Omarchy', slug: 'omarchy', docsUrl: 'https://learn.omacom.io/2/the-omarchy-manual' },
  { name: 'WezTerm', slug: 'wezterm', docsUrl: 'https://wezterm.org/' },
  { name: 'MySQL', slug: 'mysql', docsUrl: 'https://dev.mysql.com/doc/' },
  { name: 'Claude Code', slug: 'claude', docsUrl: 'https://code.claude.com/docs/en/overview' },
  { name: 'OpenCode', monogram: 'OC', docsUrl: 'https://opencode.ai/docs/' },
  { name: 'OpenSpec', monogram: 'OS', docsUrl: 'https://github.com/Fission-AI/OpenSpec' },
  { name: 'Microsoft Office', slug: 'microsoftoffice', localIcon: '/icons/microsoftoffice.svg', docsUrl: 'https://support.microsoft.com/en-us/office' },
  { name: 'Copilot Chat', slug: 'githubcopilot', docsUrl: 'https://docs.github.com/en/copilot' },
  { name: 'XNA', monogram: 'XNA', localIcon: '/icons/xna.svg', docsUrl: 'https://learn.microsoft.com/en-us/previous-versions/windows/xna/bb200104(v=xnagamestudio.41)' },
  { name: 'MonoGame', slug: 'monogame', docsUrl: 'https://docs.monogame.net/' },
  { name: 'Visual Studio', slug: 'visualstudio', localIcon: '/icons/visualstudio.svg', docsUrl: 'https://learn.microsoft.com/en-us/visualstudio/' },
  { name: 'Rider', slug: 'rider', localIcon: '/icons/rider.svg', docsUrl: 'https://www.jetbrains.com/rider/documentation/' },
  { name: 'PyCharm', slug: 'pycharm', localIcon: '/icons/pycharm.svg', docsUrl: 'https://www.jetbrains.com/help/pycharm/' },
  { name: 'Python', slug: 'python', localIcon: '/icons/python.svg', docsUrl: 'https://docs.python.org/3/' },
  { name: 'Jenkins', slug: 'jenkins', localIcon: '/icons/jenkins.svg', docsUrl: 'https://www.jenkins.io/doc/' },
  { name: 'npm', slug: 'npm', localIcon: '/icons/npm.svg', docsUrl: 'https://docs.npmjs.com/' },
  { name: 'Ubuntu', slug: 'ubuntu', localIcon: '/icons/ubuntu.svg', docsUrl: 'https://ubuntu.com/server/docs' },
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
        <a
          v-for="tech in techStack"
          :key="tech.name"
          :href="tech.docsUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="tech-card"
          :aria-label="`Open ${tech.name} documentation`"
        >
          <img
            v-if="tech.slug || tech.localIcon"
            :src="iconSrc(tech)"
            :alt="tech.name"
            class="tech-card__icon"
            loading="lazy"
          />
          <span v-else class="tech-card__icon tech-card__icon--monogram" aria-hidden="true">{{ tech.monogram }}</span>
          <span class="tech-card__name">{{ tech.name }}</span>
        </a>
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
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}

.tech-card:hover,
.tech-card:focus-visible {
  transform: translateY(-4px) scale(1.06);
  border-color: var(--color-primary);
  box-shadow: 0 12px 28px rgba(124, 58, 237, 0.22);
}

.tech-card:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
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
