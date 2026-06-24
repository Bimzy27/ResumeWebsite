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
  | 'Hosting'
  | 'Game Dev'
  | 'AI Tools'
  | 'Productivity & Design'
  | 'Misc'

// Display order for category sections. Beyond the categories explicitly
// requested (IDE, Language, CI/CD, OS, Terminal, Misc, Database), a few more
// were added to avoid dumping unrelated tools into "Misc": Framework,
// Version Control, Testing, Hosting, Game Dev, and AI Tools.
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
  'Hosting',
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
  { name: 'SQL', localIcon: '/icons/sql.svg', docsUrl: 'https://www.w3schools.com/sql/', category: 'Language' },

  { name: '.NET', slug: 'dotnet', localIcon: '/icons/dotnet.svg', docsUrl: 'https://learn.microsoft.com/en-us/dotnet/', category: 'Framework' },
  { name: '.NET Core', localIcon: '/icons/dotnet-core.svg', docsUrl: 'https://learn.microsoft.com/en-us/dotnet/core/introduction', category: 'Framework' },
  { name: 'Vue.js', slug: 'vuedotjs', docsUrl: 'https://vuejs.org/guide/introduction.html', category: 'Framework' },
  { name: 'Solid.js', slug: 'solid', localIcon: '/icons/solidjs.svg', docsUrl: 'https://www.solidjs.com/docs/latest', category: 'Framework' },
  { name: 'Expo', slug: 'expo', docsUrl: 'https://docs.expo.dev/', category: 'Framework' },

  { name: 'VS Code', slug: 'visualstudiocode', localIcon: '/icons/visualstudiocode.svg', docsUrl: 'https://code.visualstudio.com/docs', category: 'IDE' },
  { name: 'VisualStudio', slug: 'visualstudio', localIcon: '/icons/visualstudio.svg', docsUrl: 'https://learn.microsoft.com/en-us/visualstudio/', category: 'IDE' },
  { name: 'Rider', slug: 'rider', localIcon: '/icons/rider.svg', docsUrl: 'https://www.jetbrains.com/rider/documentation/', category: 'IDE' },
  { name: 'PyCharm', slug: 'pycharm', localIcon: '/icons/pycharm.svg', docsUrl: 'https://www.jetbrains.com/help/pycharm/', category: 'IDE' },
  { name: 'Neovim', slug: 'neovim', docsUrl: 'https://neovim.io/doc/', category: 'IDE' },

  { name: 'WezTerm', slug: 'wezterm', docsUrl: 'https://wezterm.org/', category: 'Terminal' },
  { name: 'PowerShell', slug: 'powershell', localIcon: '/icons/powershell.svg', docsUrl: 'https://learn.microsoft.com/en-us/powershell/', category: 'Terminal' },

  { name: 'Windows', slug: 'windows', docsUrl: 'https://learn.microsoft.com/en-us/windows/', category: 'OS' },
  { name: 'Ubuntu', slug: 'ubuntu', localIcon: '/icons/ubuntu.svg', docsUrl: 'https://ubuntu.com/server/docs', category: 'OS' },
  { name: 'Omarchy', slug: 'omarchy', docsUrl: 'https://learn.omacom.io/2/the-omarchy-manual', category: 'OS' },

  { name: 'Git', slug: 'git', docsUrl: 'https://git-scm.com/doc', category: 'Version Control' },
  { name: 'GitHub', slug: 'github', docsUrl: 'https://docs.github.com/', category: 'Version Control' },

  { name: 'GH Actions', slug: 'githubactions', docsUrl: 'https://docs.github.com/en/actions', category: 'CI/CD' },
  { name: 'Jenkins', slug: 'jenkins', localIcon: '/icons/jenkins.svg', docsUrl: 'https://www.jenkins.io/doc/', category: 'CI/CD' },
  { name: 'Docker', slug: 'docker', docsUrl: 'https://docs.docker.com/', category: 'CI/CD' },

  { name: 'Postman', slug: 'postman', docsUrl: 'https://learning.postman.com/docs/getting-started/overview/', category: 'Testing' },
  { name: 'Playwright', slug: 'playwright', localIcon: '/icons/playwright.svg', docsUrl: 'https://playwright.dev/docs/intro', category: 'Testing' },

  { name: 'MySQL', slug: 'mysql', docsUrl: 'https://dev.mysql.com/doc/', category: 'Database' },
  { name: 'SQL Server', localIcon: '/icons/sqlServer.svg', docsUrl: 'https://learn.microsoft.com/en-us/sql/sql-server/', category: 'Database' },
  { name: 'Firebase', slug: 'firebase', localIcon: '/icons/firebase.svg', docsUrl: 'https://firebase.google.com/docs', category: 'Database' },
  { name: 'Supabase', slug: 'supabase', docsUrl: 'https://supabase.com/docs', category: 'Database' },

  { name: 'Vercel', slug: 'vercel', docsUrl: 'https://vercel.com/docs', category: 'Hosting' },

  { name: 'Unity', slug: 'unity', color: '000000', docsUrl: 'https://docs.unity3d.com/', category: 'Game Dev' },
  { name: 'MonoGame', slug: 'monogame', docsUrl: 'https://docs.monogame.net/', category: 'Game Dev' },
  { name: 'XNA', monogram: 'XNA', localIcon: '/icons/xna.svg', docsUrl: 'https://learn.microsoft.com/en-us/previous-versions/windows/xna/bb200104(v=xnagamestudio.41)', category: 'Game Dev' },

  { name: 'Claude', slug: 'claude', docsUrl: 'https://code.claude.com/docs/en/overview', category: 'AI Tools' },
  { name: 'OpenCode', monogram: 'OC', docsUrl: 'https://opencode.ai/docs/', category: 'AI Tools' },
  { name: 'OpenSpec', monogram: 'OS', docsUrl: 'https://github.com/Fission-AI/OpenSpec', category: 'AI Tools' },
  { name: 'Copilot', slug: 'githubcopilot', docsUrl: 'https://docs.github.com/en/copilot', category: 'AI Tools' },

  { name: 'Figma', slug: 'figma', docsUrl: 'https://help.figma.com/', category: 'Productivity & Design' },
  { name: 'Canva', slug: 'canva', localIcon: '/icons/canva.svg', docsUrl: 'https://www.canva.com/help/', category: 'Productivity & Design' },
  { name: 'MS Office', slug: 'microsoftoffice', localIcon: '/icons/microsoftoffice.svg', docsUrl: 'https://support.microsoft.com/en-us/office', category: 'Productivity & Design' },
  { name: 'Jira', slug: 'jira', docsUrl: 'https://support.atlassian.com/jira-software-cloud/', category: 'Productivity & Design' },
  { name: 'Trello', slug: 'trello', docsUrl: 'https://support.atlassian.com/trello/', category: 'Productivity & Design' },

  { name: 'NPM', slug: 'npm', localIcon: '/icons/npm.svg', docsUrl: 'https://docs.npmjs.com/', category: 'Misc' },
  { name: 'DotMemory', monogram: 'dM', localIcon: '/icons/dotmemory.svg', docsUrl: 'https://www.jetbrains.com/help/dotmemory/', category: 'Misc' },
  { name: 'NuGet', slug: 'nuget', docsUrl: 'https://learn.microsoft.com/en-us/nuget/', category: 'Misc' },
]

// Group techStack into ordered, named sections for rendering.
const techStackByCategory = CATEGORY_ORDER.map((category) => ({
  category,
  items: techStack.filter((tech) => tech.category === category),
})).filter((group) => group.items.length > 0)

// Card width/gap must match the .tech-card / .tech-grid CSS below exactly.
// Relying on the browser to auto-size a category box around a nested flex
// row (intrinsic sizing through two layers of flex) was unreliable — boxes
// kept rendering uneven left/right padding around the cards (and sometimes
// clipped the last card). Computing every width explicitly in pixels — both
// the card row and the box that wraps it — removes that ambiguity entirely:
// nothing is left for the browser to auto-fit.
const CARD_WIDTH = 64
const CARD_GAP = 8
const BOX_PAD_H = 16 // matches the left/right value in .tech-category's padding
const BOX_BORDER = 1 // matches .tech-category's border-width

function cardRowWidth(count: number): number {
  return count * CARD_WIDTH + (count - 1) * CARD_GAP
}

function rowWidthPx(count: number): string {
  return `${cardRowWidth(count)}px`
}

// Rough, deliberately generous estimate of a category title's rendered
// width (bold, uppercase, letter-spaced Space Grotesk at 0.78rem) — it only
// needs to never undershoot the real text, not match it exactly.
function titleEstimateWidth(title: string): number {
  return title.length * 9.5 + 24
}

// The box must be at least as wide as its card row AND at least as wide as
// its title, whichever is larger — and that exact number, not something the
// browser approximates. Cards are then centered (.tech-grid's margin: 0
// auto) inside whatever width results, so left/right padding around them is
// always equal.
function categoryWidthPx(category: string, count: number): string {
  const content = Math.max(cardRowWidth(count), titleEstimateWidth(category))
  return `${content + BOX_PAD_H * 2 + BOX_BORDER * 2}px`
}
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
          :style="{ width: categoryWidthPx(group.category, group.items.length) }"
        >
          <h3 class="tech-category__title">{{ group.category }}</h3>
          <div class="tech-grid" :style="{ width: rowWidthPx(group.items.length) }">
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
/* Each category is a self-contained block. Its width is set explicitly via
   an inline style (computed by categoryWidthPx) rather than left to the
   browser to auto-fit around its nested children — that auto-fit approach
   repeatedly produced uneven left/right padding around the cards. The outer
   container then flex-wraps those fixed-width blocks left-to-right,
   top-to-bottom — the browser's wrapping algorithm packs differently-sized
   category blocks together "tetris-style" to fill the available width,
   rather than every category eating a full row regardless of how few items
   it has. */
.tech-categories {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 18px;
  margin-top: 32px;
}

.tech-category {
  flex: 0 0 auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 14px 16px 16px;
}

.tech-category__title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.78rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--color-text-muted, var(--color-text));
  margin-bottom: 10px;
  /* The box's explicit width (see categoryWidthPx) is whichever is larger
     of the title or the card row, so the narrower of the two always has
     slack space on either side. Centering both the title and the card row
     (below) splits that slack evenly, instead of the narrower one hugging
     the left edge. */
  text-align: center;
}

/* Single row per category: cards never wrap to a second line. The row sizes
   itself to fit its cards exactly (no overflow, no scrollbar) — the
   category block's width simply grows to match, and the outer flex-wrap
   container packs blocks around it. */
.tech-grid {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  margin: 0 auto;
}

.tech-card {
  display: flex;
  flex: 0 0 64px;
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
  white-space: nowrap;
}

/* On narrow viewports a full-width single-row category could overflow the
   page horizontally. Let those rows wrap to a second line there instead of
   forcing a scrollbar or clipping cards. The explicit widths set inline (to
   make box sizing exact on desktop) have to be overridden here, since an
   inline style otherwise wins over a stylesheet rule. */
@media (max-width: 480px) {
  .tech-grid {
    width: auto !important;
    flex-wrap: wrap;
  }

  .tech-category {
    width: auto !important;
    flex: 1 1 100%;
  }
}
</style>
