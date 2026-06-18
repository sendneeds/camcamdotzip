# camcam.zip custom theme backup

Saved before reverting to the default Quartz styling (commit baseline: e464f64).

Includes the blowout margin layout, Instrument Serif / DM Sans / Menlo fonts,
ASCII explorer tree, collapsible headers, and left-rail ToC experiment.

To restore this theme later, copy these files back over the repo equivalents:

- custom.scss  → quartz/styles/custom.scss
- variables.scss → quartz/styles/variables.scss
- quartz.config.yaml → quartz.config.yaml
- Head.tsx → quartz/components/Head.tsx
- blowout.js → quartz/static/blowout.js (and ensure Head.tsx references it)

Created: 2026-06-18
