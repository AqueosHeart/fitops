---
type: log
project: FitOps
date: 2026-09-22
status: native-rerun-pending
---

# Sidebar-readable wireframe page names

- User confirmed the prior grouped output still looked unchanged because every Figma page began with the shared `FitOps Wireframes / date /` prefix and Figma truncated the actual group name in the sidebar.
- The generator now writes the review group first: `01 · Public · Home — FitOps YYYY-MM-DD vN`. Grouped Legal & Misc, account, club, trainer, member, and administrator pages are visible directly in the sidebar.
- Regrouping continues to accept both the prior prefix-first output and the new sidebar-readable version. It removes source pages containing only generated output, while preserving any page with other layers as a clearly labeled archive.
- Rebuilt bundle, structural generator test, static UX synchronization, and diff check pass. Native Figma run and visual QA remain pending.
