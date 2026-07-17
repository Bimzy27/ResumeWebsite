---
name: release
description: Cut a production release for this repo by promoting develop into master through a release pull request. Use when asked to release, cut a release, promote develop, or finalize a merged release PR. Never merges into master directly; a human merges the PR.
---

# Release (ResumeWebsite)

Cut a production release for brandenimmerzeel.au.
Production deploys from `master` on Vercel, day-to-day work lives on `develop`, and the only path between them is a release pull request that a human reviews and merges.

This skill replaces the global /release promote flow for this repo.
Never merge, push, or commit to `master` directly, and never merge the release PR yourself, even if asked to hurry.
The human merge of the PR is the release approval; there is no flag to bypass it.

## Branch model

- `develop`: integration branch; all feature and fix work is committed here.
- `master`: release branch; every commit on it is production.
- Releases are tagged `vX.Y.Z` on `master`, with a matching GitHub release.

## Determine the phase

The skill has two phases and is safe to invoke at any point; detect where things stand and continue from there.

Check for an existing release PR:

```bash
gh pr list --base master --head develop --state open --json number,title,url
gh pr list --base master --head develop --state merged --limit 1 --json number,title,url,mergedAt
```

- No open release PR and no unfinalized merge: run **Phase A: Prepare**.
- Open release PR: report its URL and status, re-run the gate only if develop moved since it was opened, and remind that a human must merge it.
- Merged release PR whose version tag does not exist yet: run **Phase B: Finalize**.

## Phase A: Prepare the release

1. **Preflight on develop.**
   Working tree clean, `develop` checked out, and in sync with `origin/develop` after a fetch.
   Commit or shelve stray changes via /commit first; never build a release from a dirty tree.

2. **Back-merge master if it has diverged.**
   If `git log develop..master --oneline` shows commits (a hotfix landed on master), merge `master` into `develop`, resolve conflicts on develop, and push.
   The release PR must show master gaining exactly the develop delta, nothing lost.

3. **Run the quality gate.**
   Invoke /patrol on develop and fix failures until it is fully green.
   For this repo that means: typecheck and build (`npm run build` in `client/`, which runs `vue-tsc`), lint (`npm run lint`, zero warnings), police, and the Playwright e2e suite (`npm run test:e2e`).
   A red or skipped gate blocks the release; do not open the PR until it passes.

4. **Pick the version.**
   Find the latest `v*` tag (`git describe --tags --abbrev=0` or `git tag -l 'v*' --sort=-v:refname`).
   Bump it by the conventional-commit types in `git log master..develop`: any breaking change bumps major, any `feat` bumps minor, otherwise bump patch.
   If no tag exists yet, the first release is `v1.0.0`.

5. **Open the release PR.**

   ```bash
   gh pr create --base master --head develop --title "release: vX.Y.Z" --body "..."
   ```

   The body must contain:
   - A short summary of what this release delivers, written for a human deciding whether to merge.
   - The commit list from `git log master..develop --oneline`, grouped by type (features, fixes, other).
   - The quality gate result: which stages ran and that all were green.
   - The planned tag (`vX.Y.Z`).

6. **Stop and hand over.**
   Report the PR URL and state plainly that the release now waits on a human to review and merge it.
   Do not approve, merge, or enable auto-merge on the PR.

## Phase B: Finalize after the human merges

1. **Confirm the merge.**
   Verify the release PR is merged and identify the merge commit on `master`.

2. **Tag the release.**

   ```bash
   git checkout master && git pull
   git tag -a vX.Y.Z -m "release vX.Y.Z"
   git push origin vX.Y.Z
   ```

   Use the version from the PR title; never re-derive it after the merge.

3. **Publish the GitHub release.**

   ```bash
   gh release create vX.Y.Z --title "vX.Y.Z" --notes "..."
   ```

   Reuse the change summary from the PR body as the notes.

4. **Watch the deploy.**
   Vercel deploys `master` to production automatically.
   Confirm the deployment started and finished green when status is observable (Vercel dashboard, `gh` checks on the merge commit, or a probe of https://brandenimmerzeel.au showing the new build).
   Smoke-test the live site: it loads, the hero renders, and the change most central to this release is visible.

5. **Sync develop and return to it.**
   Merge `master` back into `develop` if the PR merge left master with commits develop lacks, push, and check out `develop` so the next work lands in the right place.

## Report

- Phase A: the commit range prepared, the gate result, the PR URL, and that the release awaits human merge.
- Phase B: the tag and GitHub release URL, the production deploy status, and what was smoke-tested.

## Guardrails

- Never push, merge, or commit to `master`; the release PR merged by a human is the only way changes reach it.
- Never open a release PR over a red or skipped quality gate.
- Never tag or publish a GitHub release before the PR is merged.
- A merge conflict in the PR is resolved by merging `master` into `develop` and updating the PR, never by editing `master`.
- Always end on `develop`.
