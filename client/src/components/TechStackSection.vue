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
  // Grouping used to render the grid as labeled sections. See CATEGORY_ROWS
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
  | 'AI Tooling'
  | 'Productivity & Design'
  | 'Misc'

// The category sections are laid out as exactly FOUR explicit rows (rather
// than a single flex-wrap container that the browser packs into a variable
// number of rows). Each inner array is one visible row, rendered left to
// right; the rows stack top to bottom. AI Tooling is intentionally the very
// first box in the first row. The grouping is hand-balanced so each row's
// boxes have a similar combined width and no row overflows the section
// width (which would make it wrap internally and appear as a 5th row).
const CATEGORY_ROWS: Category[][] = [
  ['AI Tooling', 'Language', 'Hosting'],
  ['Framework', 'IDE', 'OS'],
  ['Productivity & Design', 'Database', 'CI/CD'],
  ['Game Dev', 'Misc', 'Version Control', 'Terminal', 'Testing'],
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

  { name: 'Windows', slug: 'windows', localIcon: '/icons/windows_os.svg', docsUrl: 'https://learn.microsoft.com/en-us/windows/', category: 'OS' },
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

  { name: 'Claude', slug: 'claude', docsUrl: 'https://code.claude.com/docs/en/overview', category: 'AI Tooling' },
  { name: 'Copilot', slug: 'githubcopilot', docsUrl: 'https://docs.github.com/en/copilot', category: 'AI Tooling' },
  { name: 'MCP', localIcon: '/icons/Model_Context_Protocol_logo.svg', docsUrl: 'https://modelcontextprotocol.io/', category: 'AI Tooling' },
  { name: 'OpenCode', localIcon: '/icons/opencode.svg', docsUrl: 'https://opencode.ai/docs/', category: 'AI Tooling' },
  { name: 'OpenSpec', monogram: 'OS', docsUrl: 'https://github.com/Fission-AI/OpenSpec', category: 'AI Tooling' },

  { name: 'Figma', slug: 'figma', docsUrl: 'https://help.figma.com/', category: 'Productivity & Design' },
  { name: 'Canva', slug: 'canva', localIcon: '/icons/canva.svg', docsUrl: 'https://www.canva.com/help/', category: 'Productivity & Design' },
  { name: 'MS Office', slug: 'microsoftoffice', localIcon: '/icons/microsoftoffice.svg', docsUrl: 'https://support.microsoft.com/en-us/office', category: 'Productivity & Design' },
  { name: 'Jira', slug: 'jira', docsUrl: 'https://support.atlassian.com/jira-software-cloud/', category: 'Productivity & Design' },
  { name: 'Trello', slug: 'trello', docsUrl: 'https://support.atlassian.com/trello/', category: 'Productivity & Design' },

  { name: 'NPM', slug: 'npm', localIcon: '/icons/npm.svg', docsUrl: 'https://docs.npmjs.com/', category: 'Misc' },
  { name: 'DotMemory', monogram: 'dM', localIcon: '/icons/dotmemory.svg', docsUrl: 'https://www.jetbrains.com/help/dotmemory/', category: 'Misc' },
  { name: 'NuGet', slug: 'nuget', docsUrl: 'https://learn.microsoft.com/en-us/nuget/', category: 'Misc' },
]

// Group techStack into the four hand-balanced rows for rendering. Each row
// is an array of { category, items } groups; empty categories are dropped.
const techStackRows = CATEGORY_ROWS.map((row) =>
  row
    .map((category) => ({
      category,
      items: techStack.filter((tech) => tech.category === category),
    }))
    .filter((group) => group.items.length > 0),
)

// NOTE: All sizing is now done in CSS, not computed here. Earlier versions
// derived pixel widths from a fixed 64px-per-card assumption, but cards whose
// label is wider than 64px (e.g. "VisualStudio") grow past that, so the
// computed width no longer matched the real card row and the cards drifted off
// center. Instead the card row (.tech-grid) and category box (.tech-category)
// shrink-wrap to their real content via CSS width: max-content, so they always
// hug the true cards — long labels included — with no manual pixel math.
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

      <div class="tech-rows">
        <div
          v-for="(row, rowIndex) in techStackRows"
          :key="rowIndex"
          class="tech-row"
        >
          <div
            v-for="group in row"
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
    </div>
  </section>
</template>

<style scoped>
/* Give this section more horizontal room than the default 1100px container so
   each of the four category rows fits on one line (with the boxes justified
   across the full width) instead of wrapping into a fifth row. */
#tech-stack .container {
  max-width: 1240px;
}

/* Four explicit rows, stacked vertically. The block spans the full container
   width, and each row spreads its boxes across that full width (space-between),
   so every row's first box sits flush to the same left edge and its last box
   flush to the same right edge. */
.tech-rows {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 32px;
}

.tech-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  /* space-between pushes the first box to the row's left edge and the last box
     to its right edge; the 18px gap is the minimum spacing between boxes, with
     any extra width distributed into the gaps. */
  justify-content: space-between;
  gap: 18px;
}

/* Each box shrink-wraps to its content via width: max-content — it is exactly
   as wide as whichever is wider, its title or its real card row (long card
   labels included). The card row inside is centered (margin: 0 auto) and the
   left/right padding is symmetric, so the cards always sit 16px in from each
   edge and never spill past the border. */
.tech-category {
  flex: 0 0 auto;
  width: max-content;
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
  /* Centered over the box; a title longer than the card row wraps (and breaks
     a too-long single word) rather than widening the box. */
  text-align: center;
  overflow-wrap: break-word;
  max-width: 100%;
}

/* Single row of cards, never wrapping. width: max-content makes it exactly as
   wide as the real cards — including any card that grew past 64px for a long
   label — and margin: 0 auto centers it inside the box, so the padding on both
   sides stays equal and the cards never overflow the border. */
.tech-grid {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  width: max-content;
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
   forcing a scrollbar or clipping cards. The explicit grid width set inline
   has to be overridden here, since an inline style otherwise wins. */
@media (max-width: 480px) {
  .tech-rows {
    width: auto !important;
  }

  .tech-row {
    justify-content: center;
  }

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
