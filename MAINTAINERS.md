# Maintainer guidelines

## Releasing

- Use `npm version` and push. The publish workflow handles the rest.
- Create a GitHub Release for the new tag with release notes following the style guide below.

## Release notes style guide

Formatting:

- Use past tense verbs to start the sentence, e.g. "Fixed", "Added", "Removed", ...
- Each bullet point is a sentence (or more), and so ends with a period.
- Package names are in `code`, sometimes linked to their <https://www.npmjs.com/> page.
- Prefer referring to methods and properties via `someInstance.prop`, instead of `ClassName.prototype.prop`. (Never use `ClassName.prop` except for statics.)
- Refer to attributes via `attr=""`.
- Refer to elements via `<element>`.
- Refer to events via `eventname`.
- Refer to CSS properties via `'propname'`.
- Never use the IDL terms "interface", "attribute", or "operation".
- URL schemes are in `code`, e.g. `data:`.
- All version numbers get a "v" prefix, e.g. v12.2.0.
- Follow the bullet point with parenthetical GitHub @-mentions when contributed by a non-core team member, e.g. "Fixed foo. (@person)"

Other guidelines:

- Commit messages are primarily for jsdom developers. Release notes are primarily for users. Usually you cannot reuse the commit message.
- Sometimes a single commit may expand to multiple release note entries.
- Do not include commits that have no user-facing impact, e.g. test rolls, refactorings, benchmark additions, etc.
- For regression fixes, note the version in which something regressed.
- Breaking changes get their own section.
- Group in the order "Added", "Removed", "Changed", "Fixed".
- Roughly order changes within those groupings by impact.

## Minimum Node.js version changes

- Update the `"engines"` field in `package.json`.
- Update `.github/workflows/jsdom-ci.yml`.
