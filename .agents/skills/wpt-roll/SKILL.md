---
name: wpt-roll
description: Roll jsdom's pinned web-platform-tests checkout, update expectations, and remove merged local tests while balancing regression coverage with maintainable test scope. Use for WPT rolls and review of their coverage changes.
---

# Roll web platform tests

Update the pinned WPT checkout and preserve jsdom's regression coverage. Use the roll to enable useful neighboring tests, with a deliberate scope based on implemented behavior. Absorbing a local regression into a large upstream directory does not commit jsdom to running that entire feature's tests.

Follow the repository's [agent instructions](../../../AGENTS.md) and [contribution policy](../../../Contributing.md). Respect the user's current local-review, testing, and publishing constraints; this skill does not authorize commits, pushes, or GitHub messages on its own.

## Establish the baseline

- Inspect recent roll commits for the current project conventions and read the relevant test infrastructure before editing. Start a new roll from jsdom's `origin/main`; preserve unrelated work in a separate worktree when necessary.
- Fetch the requested upstream tips and record both repositories' revisions. Determine WPT's actual default branch instead of assuming it is named `main`: it has used `master`.
- Use the project's `npm run wpt:update` workflow to update the submodule and regenerate `test/web-platform-tests/wpt-manifest.json`. Inspect `.gitmodules` and the npm script to understand which branch it tracks. Keep the submodule revision and manifest consistent, and preserve the manifest's existing line endings.
- Save the original manifest, expectations, and local-test inventory outside the working tree when they are useful for comparison. Keep triage results reusable, so revising expectation scope does not require repeating expensive runs. Do not regenerate edits from an old snapshot over subsequent human edits.

Useful implementation references, with paths relative to the repository root:

- `test/web-platform-tests/wpt-manifest-utils.js`: manifest entries, generated URLs, and global exclusions.
- `test/web-platform-tests/run-wpts.js` and `run-single-wpt.js` in the same directory: directory selection, test execution, and harness behavior.
- `test/web-platform-tests/expectations-utils.js`: pattern precedence, expected failures, skips, canvas handling, and Node-version conditions.
- `test/web-platform-tests/to-run.yaml` and `to-upstream-expectations.yaml`: upstream and local expectations.

## Replace merged local tests without weakening regressions

Inventory both ordinary and `-dont-upstream` files under `test/web-platform-tests/to-upstream`. A WPT roll can make either kind redundant.

For each candidate deletion:

1. Identify the replacement in the pinned checkout and compare its assertions and fixtures. Matching filenames are a useful starting point, not proof of equivalent coverage. Conversely, an upstream file with a different name may subsume a local companion.
1. Resolve the replacement's actual runnable URLs through the manifest. Sources such as `.window.js` and `.any.js` generate HTML test URLs, sometimes with several global or query variants. Expectations must target those URLs.
1. Establish that jsdom will run the replacement with the required assertions enforced. Check its `DIR`, matching globs, global exclusions, subtest expectations, harness dependencies, and canvas conditions. A file merely existing in WPT is insufficient; for example, an IDL harness can fail because `fetch()` is unavailable.
1. Preserve the local test's effective expectations when replacing it. If upstream added failing assertions, use focused subtest expectations where practical. If the updated test no longer enforces the old behavior, retain a focused `-dont-upstream` companion with a comment naming the upstream file and explaining the remaining coverage gap.
1. Delete support files only after checking their remaining consumers, including surviving local companions and cross-directory references.

Also compare previously enabled upstream tests across the roll. An upstream rewrite can weaken coverage without deleting any local file: changing a formerly passing file to a whole-file expected failure stops enforcing its old passing assertions. Retain those assertions through subtest expectations or a focused local companion when needed.

Use the pinned checkout as the canonical source for merged tests. Avoid hand-copying current upstream tests into `to-upstream` to bypass directory selection or harness problems. If a local companion is necessary, preserve the specific regression it exists to enforce.

Record every deleted path and its upstream replacement in the roll's commit message, including support files and companions. For byte-identical, same-path replacements, a list of paths with an explicit statement of the destination root is sufficient. Preserve these mappings when revising the commit.

## Triage scope before optimizing expectations

Account for newly runnable tests in each expanded directory using source inspection, the implementation, and observed results. Run tests where execution is needed to resolve their behavior. A broad exclusion should express a triage conclusion, never hide an untriaged remainder.

Choose what is worth running before shortening individual failure entries:

- Preserve existing intentional coverage and the migrated regressions. Then consider nearby tests exercising the same implemented behavior.
- A tiny parsing fix does not justify enabling a whole animation, rendering, or navigation feature. Broad negative globs with focused exceptions are often the right result.
- Keep useful parsing, serialization, CSSOM, state, reflection, and event coverage within otherwise unsupported areas. Do not retain files mechanically because their names contain `parsing`, `computed`, or `inheritance`; read what the assertions actually require.
- Absence of a dedicated file in `lib/jsdom/living/css/properties` does not establish absence of parsing support. Check `scripts/generate-css-style-properties.js` and `lib/jsdom/living/css/helpers/generic-property-descriptor.js`: generic descriptors provide property handling too.
- Finishing quickly is not a reason to run hundreds of expected failures against absent APIs. Likewise, a passing test may only compare zero-valued geometry, compare `NaN` values, observe an ignored query, or execute an empty crash-test callback. Such results do not establish support for the surrounding feature.
- Ask for calibration when the tradeoff is material. Present the concrete behavior, useful assertions, expectation cost, and a recommendation. Make the unambiguous local edits while the user considers the choice.

Examples of the distinction, to reconsider against the implementation at each roll:

| Area | Useful coverage to consider | Broadly exclude when unsupported |
| --- | --- | --- |
| CSS animations | An `animation-name` regression, nearby declaration parsing, and keyframes CSSOM | Animation execution and Web Animations API tests |
| Grid | A migrated mixed-track `calc()` regression and nearby column/row grammar tests | Grid layout and unrelated grid property behavior |
| Container queries | The migrated rule regressions, basic property parsing, and useful `CSS.supports()` checks | Container-query evaluation and invalidation |
| Sizing | Width/height/min/max parsing and aspect-ratio property tests | Layout, intrinsic sizing, and responsive iframe behavior |
| Media elements | State and reflection, volume/rate setters, and their queued events | Resource selection, playback, seeking, and text-track processing |
| Iframes and forms | Implemented loading, DOM relationships, submission checks, and events | Unsupported sandboxing, lazy loading, and navigation |

The appropriate scope can differ between directories. Broad basic-sizing parsing coverage may be worthwhile while grid retains only a handful of related files. Do not turn these examples into permanent allowlists or assume every roll should enable the same directories.

## Write concise, accurate expectations

Understand the current runner's semantics before choosing an expectation:

- A whole-file `[fail, reason]` still runs the file, but no longer protects each previously passing subtest independently. Prefer subtest expectations for valuable implemented behavior when the list is manageable.
- Skip statuses such as `fail-slow` and `timeout` do not run the file. Group unsupported feature families where appropriate, using an honest reason. Do not label unexamined cases as timeouts or failures.
- Preserve a useful parsing file rather than automatically discarding it for a few failing edge cases. Conversely, hundreds of exceptions for mostly unsupported behavior are usually a reason to narrow scope or exclude the file. Optimize neither raw passing counts nor line counts in isolation.
- Use short comments to explain which behavior a negative glob preserves when that is not obvious. Avoid repeated explanations on every entry.

Patterns use Node's `path.matchesGlob()`, not shell expansion or another glob library. The first matching expectation wins within a directory, and directory sections and patterns must be lexicographically sorted. Match against manifest URLs, including query variants, and account for global exclusions and tentative tests separately.

Root files and nested files need separate consideration. For example, `!(parsing)/**` excludes descendants of other directories but does not exclude their sibling root-level HTML files. A root-level negative glob and a nested glob may both be needed. Check exact matches when validation is permitted; patterns matching no manifest entries are rejected by the runner.

When widening a `DIR` that previously enabled only a child directory, preserve that child's expectations and coverage. Avoid accidentally skipping those tests or running them twice through overlapping parent and child sections.

## Verify at the permitted stage and deliver a reviewable diff

If the user requests discussion or local editing without tests or validations, keep that boundary and state that the latest draft is unvalidated. Otherwise:

- Follow the npm scripts and test-output guidance in `AGENTS.md`. Run relevant WPT selections with `--reporter min`; `--fgrep` matches test titles as a substring, not filesystem paths.
- Compare effective coverage against the original configuration, especially every migrated URL and every previously passing test changed to an expected failure or skip. Check pattern selection as well as execution results.
- Exercise the affected tests with and without optional canvas support when it can change their results. Ensure the no-canvas run actually takes the absent-canvas path and describe how it was obtained.
- Complete the relevant upstream and local WPT runs and lint at finalization, using a full WPT run when appropriate for the roll and the user's testing constraints. Reuse existing results until edits or unresolved failures justify another run. Do not repeatedly run the full suite to adjust formatting or scope.
- Investigate unexpected passes as well as failures. Distinguish changes to the pinned tests, stale expectations, environment issues, and reproducible implementation gaps. Do not turn one unexplained failure into a permanent flaky exemption.

Mocha's passing count includes successful expected-failure wrappers. It is not the number of WPT files that pass outright or the number of protected assertions. Tie reported results to the exact configuration tested; earlier successful runs do not validate a later expectation rewrite.

Keep the review focused on the net diff against jsdom's base branch. When the user wants an uncommitted diff against `origin/main`, provide a worktree with that baseline and preserve any published branch separately. Prefer local iteration while calibrating scope instead of repeatedly rewriting a remote branch. Do not push until publishing is within the user's requested scope.

The final roll should contain the submodule and manifest update, scoped expectations, justified local deletions or companions, and durable deletion mappings in the commit message. Keep detailed triage logs outside the source tree unless requested, and keep implementation fixes separate unless they are part of the agreed task.
