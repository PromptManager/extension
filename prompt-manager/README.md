
# Prompt Manager Extension

 This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

## Getting Started

### Prerequisites

- Node.js installed on your system
- pnpm installed on your system

###  Installation

```bash
pnpm install
```

```bash
pnpm install plasmo --save-dev
```

###  Run:

> Builds to `build/chrome-mv3-dev` and supports hot reload when loaded in Chrome
```bash
pnpm dev
```

### Load the dev Extension in Chrome

1. Go to `chrome://extensions`
2. Enable Developer Mode
3. Click "Load Unpacked"
4. Select the `build/chrome-mv3-dev` directory

## Making production build

```bash
pnpm build
```
> builds to `build/chrome-mv3-prod`

This should create a production bundle for your extension, ready to be zipped and published to the stores.
