---
name: pnpm reinstall quirk after package add
description: node_modules go missing after pnpm add in a sub-package; fix with root pnpm install
---

## Rule
After running `pnpm --filter @workspace/X add <package>`, always run `pnpm install` at the workspace root before restarting workflows.

**Why:** The sub-package add can invalidate symlinks in sibling packages (vite, esbuild etc.). Root install restores all symlinks in one pass.
