# minimal-electron-bsql

A bare-bones Electron + TypeScript + [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) app.  
No forge, no boilerplate, no scaffolding. Just the absolute minimum setup that:

- Runs in dev mode on macOS/Linux/Windows
- Uses `better-sqlite3` from the **main process**
- Creates a SQLite DB at startup, inserts + selects a row
- Displays a trivial HTML UI
- Can be packaged for distribution (SQLite included)

---

## Project structure

```
minimal-electron-bsql/
├── src/
│ └── main/
│ └── index.ts # Electron main process
├── renderer/
│ └── index.html # Minimal UI
├── package.json
├── tsconfig.json
```

## Requirements

- Node.js ≥ 18
- macOS (Apple Silicon or Intel). Windows & Linux should work with native build tools installed.
- Xcode Command Line Tools (macOS) or MSVC Build Tools (Windows) for native rebuilds

---

## Install

```bash
git clone <this-repo>
cd minimal-electron-bsql
npm install
```

ℹ️ On install, native modules are rebuilt for your Electron version via `@electron/rebuild`.

⸻

Scripts

- npm run dev → compile TS and start Electron in dev mode
- npm run build → compile TypeScript only
- npm run start → start Electron with compiled code
- npm run rebuild → force-rebuild native modules (better-sqlite3)
- npm run dist → create distributable builds via electron-builder
- npm run pack → package into unpacked app directory

## What happens on startup

In src/main/index.ts:

1. Database file created at app.getPath('userData')/app.db
2. A table messages is created (if not exists)
3. One row "hello from better-sqlite3" is inserted
4. A SELECT runs and the row is logged to console
5. Window shows renderer/index.html → just <main>hi</main>

⸻

Packaging notes
• Native modules: better-sqlite3.node must live outside app.asar. This is handled via:

```
"asarUnpack": ["node_modules/better-sqlite3/**/*"]
```

- Cross-arch builds (macOS):
- Build separately for arm64 and x64:

```bash
npm run dist -- --mac arm64
npm run dist -- --mac x64
```

- Optionally merge into a universal binary:

```bash
npx electron-builder --universal
```

- Database location: Always use app.getPath('userData'). Do not write next to your code files, since those are inside app.asar when packaged.

⸻

Common pitfalls & fixes

- was compiled against a different Node.js version error
- Run npm run rebuild after npm install or upgrading Electron.
- .node module not found after packaging
- Check asarUnpack includes better-sqlite3.
- Windows/Linux builds
- Windows: install Build Tools for Visual Studio + Python
- Linux: sudo apt install build-essential python3

## License

MIT
