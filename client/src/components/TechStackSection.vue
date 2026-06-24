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
  // Grouping used to render the grid as labeled sections. See CATEGORY_ORDER
  // below for the display order.
  category: Category
}

type Category =
  | 'Language'
  | 'Framework'
  | 'IDE'
  | 'Terminal'
  | 'OS'
  | 'Version Control'
  | 'CI/CD'
  | 'Testing'
  | 'Database'
  | 'Cloud & Hosting'
  | 'Game Dev'
  | 'AI Tools'
  | 'Productivity & Design'
  | 'Misc'

// Display order for category sections. Beyond the categories explicitly
// requested (IDE, Language, CI/CD, OS, Terminal, Misc, Database), a few more
// were added to avoid dumping unrelated tools into "Misc": Framework,
// Version Control, Testing, Cloud & Hosting, Game Dev, and AI Tools.
const CATEGORY_ORDER: Category[] = [
  'Language',
  'Framework',
  'IDE',
  'Terminal',
  'OS',
  'Version Control',
  'CI/CD',
  'Testing',
  'Database',
  'Cloud & Hosting',
  'Game Dev',
  'AI Tools',
  'Productivity & Design',
  'Misc',
]

// Resolves the actual <img> src for a tech item: a local asset if one was
// supplied, otherwise the Simple Icons CDN (with optional color override).
function iconSrc(tech: TechItem): string {
  if (tech.localIcon) return tech.localIcon
  return `https://cdn.simpleicons.org/${tech.slug}${tech.color ? `/${tech.color}` : ''}`
}

const techStack: TechItem[] = [
  { name: 'C#', slug: 'csharp', localIcon: '/icons/csharp.svg', docsUrl: 'https://learn.microsoft.com/en-us/dotnet/csharp/', category: 'Language' },
  { name: 'TypeScript', slug: 'typescript', docsUrl: 'https://www.typescriptlang.org/docs/', category: 'Language' },
  { name: 'JavaScript', slug: 'javascript', docsUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', category: 'Language' },
  { name: 'HTML', slug: 'html5', docsUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTML', category: 'Language' },
  { name: 'CSS', slug: 'css3', localIcon: '/icons/css3.svg', docsUrl: 'https://developer.mozilla.org/en-US/docs/Web/CSS', category: 'Language' },
  { name: 'Python', slug: 'python', localIcon: '/icons/python.svg', docsUrl: 'https://docs.python.org/3/', category: 'Language' },

  { name: '.NET', slug: 'dotnet', localIcon: '/icons/dotnet.svg', docsUrl: 'https://learn.microsoft.com/en-us/dotnet/', category: 'Framework' },
  { name: '.NET Core', localIcon: '/icons/dotnet-core.svg', docsUrl: 'https://learn.microsoft.com/en-us/dotnet/core/introduction', category: 'Framework' },
  { name: 'Vue.js', slug: 'vuedotjs', docsUrl: 'https://vuejs.org/guide/introduction.html', category: 'Framework' },
  { name: 'Solid.js', slug: 'solid', localIcon: '/icons/solidjs.svg', docsUrl: 'https://www.solidjs.com/docs/latest', category: 'Framework' },
  { name: 'Expo', slug: 'expo', docsUrl: 'https://docs.expo.dev/', category: 'Framework' },

  { name: 'VS Code', slug: 'visualstudiocode', localIcon: '/icons/visualstudiocode.svg', docsUrl: 'https://code.visualstudio.com/docs', category: 'IDE' },
  { name: 'Visual Studio', slug: 'visualstudio', localIcon: '/icons/visualstudio.svg', docsUrl: 'https://learn.microsoft.com/en-us/visualstudio/', category: 'IDE' },
  { name: 'Rider', slug: 'rider', localIcon: '/icons/rider.svg', docsUrl: 'https://www.jetbrains.com/rider/documentation/', category: 'IDE' },
  { name: 'PyCharm', slug: 'pycharm', localIcon: '/icons/pycharm.svg', docsUrl: 'https://www.jetbrains.com/help/pycharm/', category: 'IDE' },
  { name: 'Neovim', slug: 'neovim', docsUrl: 'https://neovim.io/doc/', category: 'IDE' },

  { name: 'WezTerm', slug: 'wezterm', docsUrl: 'https://wezterm.org/', category: 'Terminal' },
  { name: 'PowerShell', slug: 'powershell', docsUrl: 'https://learn.microsoft.com/en-us/powershell/', category: 'Terminal' },

  { name: 'Windows', slug: 'windows', docsUrl: 'https://learn.microsoft.com/en-us/windows/', category: 'OS' },
  { name: 'Ubuntu', slug: 'ubuntu', localIcon: '/icons/ubuntu.svg', docsUrl: 'https://ubuntu.com/server/docs', category: 'OS' },
  { name: 'Omarchy', slug: 'omarchy', docsUrl: 'https://learn.omacom.io/2/the-omarchy-manual', category: 'OS' },

  { name: 'Git', slug: 'git', docsUrl: 'https://git-scm.com/doc', category: 'Version Control' },
  { name: 'GitHub', slug: 'github', docsUrl: 'https://docs.github.com/', category: 'Version Control' },

  { name: 'GitHub Actions', slug: 'githubactions', docsUrl: 'https://docs.github.com/en/actions', category: 'CI/CD' },
  { name: 'Jenkins', slug: 'jenkins', localIcon: '/icons/jenkins.svg', docsUrl: 'https://www.jenkins.io/doc/', category: 'CI/CD' },
  { name: 'Docker', slug: 'docker', docsUrl: 'https://docs.docker.com/', category: 'CI/CD' },

  { name: 'Postman', slug: 'postman', docsUrl: 'https://learning.postman.com/docs/getting-started/overview/', category: 'Testing' },
  { name: 'Playwright', slug: 'playwright', localIcon: '/icons/playwright.svg', docsUrl: 'https://playwright.dev/docs/intro', category: 'Testing' },

  { name: 'MySQL', slug: 'mysql', docsUrl: 'https://dev.mysql.com/doc/', category: 'Database' },
  { name: 'Firebase', slug: 'firebase', localIcon: '/icons/firebase.svg', docsUrl: 'https://firebase.google.com/docs', category: 'Database' },
  { name: 'Supabase', slug: 'supabase', docsUrl: 'https://supabase.com/docs', category: 'Database' },

  { name: 'Vercel', slug: 'vercel', docsUrl: 'https://vercel.com/docs', category: 'Cloud & Hosting' },

  { name: 'Unity', slug: 'unity', color: '000000', docsUrl: 'https://docs.unity3d.com/', category: 'Game Dev' },
  { name: 'MonoGame', slug: 'monogame', docsUrl: 'https://docs.monogame.net/', category: 'Game Dev' },
  { name: 'XNA', monogram: 'XNA', localIcon: '/icons/xna.svg', docsUrl: 'https://learn.microsoft.com/en-us/previous-versions/windows/xna/bb200104(v=xnagamestudio.41)', category: 'Game Dev' },

  { name: 'Claude Code', slug: 'claude', docsUrl: 'https://code.claude.com/docs/en/overview', category: 'AI Tools' },
  { name: 'OpenCode', monogram: 'OC', docsUrl: 'https://opencode.ai/docs/', category: 'AI Tools' },
  { name: 'OpenSpec', monogram: 'OS', docsUrl: 'https://github.com/Fission-AI/OpenSpec', category: 'AI Tools' },
  { name: 'Copilot Chat', slug: 'githubcopilot', docsUrl: 'https://docs.github.com/en/copilot', category: 'AI Tools' },

  { name: 'Figma', slug: 'figma', docsUrl: 'https://help.figma.com/', category: 'Productivity & Design' },
  { name: 'Canva', slug: 'canva', docsUrl: 'https://www.canva.com/help/', category: 'Productivity & Design' },
  { name: 'Microsoft Office', slug: 'microsoftoffice', localIcon: '/icons/microsoftoffice.svg', docsUrl: 'https://support.microsoft.com/en-us/office', category: 'Productivity & Design' },
  { name: 'Jira', slug: 'jira', docsUrl: 'https://support.atlassian.com/jira-software-cloud/', category: 'Productivity & Design' },
  { name: 'Trello', slug: 'trello', docsUrl: 'https://support.atlassian.com/trello/', category: 'Productivity & Design' },

  { name: 'npm', slug: 'npm', localIcon: '/icons/npm.svg', docsUrl: 'https://docs.npmjs.com/', category: 'Misc' },
  { name: 'Beyond Compare', monogram: 'BC', docsUrl: 'https://www.scootersoftware.com/support', category: 'Misc' },
  { name: 'dotMemory', monogram: 'dM', docsUrl: 'https://www.jetbrains.com/help/dotmemory/', category: 'Misc' },
]

// Group techStack into ordered, named sections for rendering.
const techStackByCategory = CATEGORY_ORDER.map((category) => ({
  category,
  items: techStack.filter((tech) => tech.category === category),
})).filter((group) => group.items.length > 0)
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

      <div class="tech-categories">
        <div
          v-for="group in techStackByCategory"
          :key="group.category"
          class="tech-category"
        >
          <h3 class="tech-category__title">{{ group.category }}</h3>
          <div class="tech-grid">
            <a
              v-for="tech in group.items"
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
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Multi-column layout packs categories densely (like masonry) instead of
   stacking every section full-width, which is what was driving the page
   height up. Column count scales with viewport width. */
.tech-categories {
  column-count: 1;
  column-gap: 28px;
  margin-top: 32px;
}

@media (min-width: 640px) {
  .tech-categories {
    column-count: 2;
  }
}

@media (min-width: 1100px) {
  .tech-categories {
    column-count: 3;
  }
}

.tech-category {
  break-inside: avoid;
  margin-bottom: 24px;
}

.tech-category__title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.78rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--color-text-muted, var(--color-text));
  margin-bottom: 10px;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(76px, 1fr));
  gap: 8px;
}

.tech-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 6px;
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
  transform: translateY(-3px) scale(1.05);
  border-color: var(--color-primary);
  box-shadow: 0 10px 22px rgba(124, 58, 237, 0.22);
}

.tech-card:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.tech-card__icon {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

.tech-card__icon--monogram {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.65rem;
  letter-spacing: 0.02em;
  color: var(--color-text-muted, var(--color-text));
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  width: 26px;
  height: 26px;
}

.tech-card__name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.68rem;
  color: var(--color-text);
  text-align: center;
}
</style>
