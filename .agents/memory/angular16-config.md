---
name: Angular 16 config gotchas
description: Angular 16 angular.json/CLI quirks that cause silent startup failures in a pnpm monorepo
---

## Rules

1. **`browserTarget` not `buildTarget`** in the `serve` architect configuration. `buildTarget` was added in Angular 17. Using it in v16 causes "Data path must have required property browserTarget" schema error.

2. **`build.configurations.development` must NOT contain `buildTarget`** — that property belongs only in the `serve` configurations. Putting it inside `build` creates a circular reference that causes "must NOT have additional properties(buildTarget)" schema validation failure.

3. **Analytics prompt blocks startup** — prefix the dev script with `NG_CLI_ANALYTICS=false` or the first run hangs waiting for interactive input, causing the workflow to time out.

4. **Arrow functions (`=>`) banned in Angular templates** — Angular's template parser treats `=>` as an assignment operator and throws "Bindings cannot contain assignments". Move all `.map(n => n[0])` and similar inline arrow-function expressions to TypeScript component methods.

**Why:** These are Angular CLI version-boundary issues; Angular 17 switched to a new application builder (`@angular-devkit/build-angular:application`) with different schema. Mixing v16 and v17 conventions in the same config causes cryptic schema validation errors.

**How to apply:** When scaffolding any Angular 16 artifact, use `browserTarget` everywhere in serve config, strip `buildTarget` from build configs, and always audit templates for `=>` before running.
