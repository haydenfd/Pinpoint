This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

## Getting Started

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

---

## Additional Notes (2026-02-01)

### Naming + structure consistency

- Components are now named in kebab-case for file paths (example: `components/bookmark-list.tsx`).
- Shared platform types live in `types/platform.ts` to avoid duplication across `platform/` and `utils/`.

### Commenting conventions

- Non-trivial functions now include short doc comments that describe the intent and the why, not just the how.
- Event-suppression code in content UIs is documented to avoid accidental regressions with host app shortcuts.

### Testing setup (scaffold)

The repo now includes a minimal Vitest + jsdom scaffold so you can add unit/UI tests without changing runtime behavior.

Scripts:

```bash
npm run test
npm run test:watch
```

Notes:

- Tests live under `tests/` and target utilities and DOM-driven navigation behavior.
- This scaffold is intentionally light to keep extension bundling untouched.
- If you haven’t installed dependencies yet, run `npm install` first (or `pnpm install`).
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a `content.ts` file to the root of the project, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

## Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/framework/workflows/submit) and you should be on your way for automated submission!


# LLM Bookmarks

A lightweight browser extension that lets you bookmark individual responses inside modern LLM chat apps and quickly navigate back to them later.

Built with Plasmo, this extension injects UI elements directly into supported LLM interfaces so bookmarks feel native and unobtrusive.

---

## What this repository is

This repository contains the source code for a Plasmo-based browser extension that:

- Adds bookmark buttons directly into LLM chat UIs
- Stores references to specific responses
- Provides a sidebar for searching and managing bookmarks
- Enables fast navigation back to bookmarked responses

The goal is to make long-running LLM conversations easier to manage without changing existing workflows.

---

## Supported platforms

Fully supported:

- ChatGPT (chatgpt.com, chat.openai.com)

Partially supported or planned:

- Claude

Bookmarks from different platforms are stored together and can be filterable by source. Navigation back to a specific response is currently implemented for ChatGPT only. Support for other platforms will be added once stable DOM anchors are available.

---

## How it works

At a high level:

1. The extension injects small UI controls into LLM interfaces using content scripts.
2. When a response is bookmarked, only lightweight references are stored:
   - Platform
   - Conversation ID
   - Message or turn ID
   - Short title preview
3. No response content or conversation text is stored.
4. A sidebar overlay allows users to:
   - View all bookmarks
   - Filter by platform
   - Search by title
   - Navigate back to the original response

All storage is local to the browser.

---

## Performance and UX

This extension is designed to be:

- Fast  
  No background polling, no heavy observers, and no network requests.

- Native-feeling  
  UI elements are injected directly into existing toolbars and panels so they visually match the host application.

- Non-intrusive  
  The extension does not interfere with existing LLM functionality.

- Lightweight  
  Storage operations are minimal and scale well even with many bookmarks.

---

## Security and privacy

- The extension does not store message content.
- Only identifiers and minimal metadata are saved.
- No data is sent to external servers.
- All data remains local to the browser profile.

This makes the extension safe to use even for sensitive conversations.

---

## Project structure

High-level overview of the codebase:

- `contents/`  
  Content scripts that inject UI into supported LLM platforms.

- `components/`  
  Shared React components such as the bookmark list and sidebar.

- `utils/`  
  Navigation helpers and platform-specific logic.

- `types/`  
  Shared TypeScript types for bookmarks and metadata.

---

## Development

Start the development server:

```bash
pnpm dev
# or
npm run dev
