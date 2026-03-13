# CopilotKit <> LangGraph Starter

This is a starter template for building AI agents using [LangGraph](https://www.langchain.com/langgraph) and [CopilotKit](https://copilotkit.ai). It provides a modern Next.js application with an integrated LangGraph agent to be built on top of.

https://github.com/user-attachments/assets/47761912-d46a-4fb3-b9bd-cb41ddd02e34

## Prerequisites

- Node.js 18+ 
- Python 3.8+
- Any of the following package managers:
  - [pnpm](https://pnpm.io/installation) (recommended)
  - npm
  - [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
  - [bun](https://bun.sh/)
- OpenAI API Key (for the LangGraph agent)

> **Note:** This repository ignores lock files (package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb) to avoid conflicts between different package managers. Each developer should generate their own lock file using their preferred package manager. After that, make sure to delete it from the .gitignore.

## Getting Started

1. Install dependencies using your preferred package manager:
```bash
# Using pnpm (recommended)
pnpm install

# Using npm
npm install

# Using yarn
yarn install

# Using bun
bun install
```


2. Set up your environment variables:
```bash
cp .env.example .env
```

Then edit the `.env` file and add your OpenAI API key:

```bash
OPENAI_API_KEY=your-openai-api-key-here
```

3. Start the development server:
```bash
# Using pnpm
pnpm run dev

# Using npm
npm run dev

# Using yarn
yarn dev

# Using bun
bun run dev
```

This will start both the UI and agent servers concurrently.

## Available Scripts
The following scripts can also be run using your preferred package manager:
- `dev` - Starts both UI and agent servers in development mode
- `dev:app` - Starts only the Next.js UI server
- `dev:agent` - Starts only the LangGraph agent server
- `build` - Builds the workspace for production
- `lint` - Runs ESLint for code linting
- `clean` - Runs workspace clean tasks
- `repair:deps` - Rebuilds dependency links when a local package bin is missing
- `test:app:e2e:install` - Installs the Playwright Chromium browser used by the app regression harness
- `test:app:e2e` - Runs the browser-level app regression harness
- `test:agent` - Runs the Python agent unit checks through `uv`
- `test` / `test:regression` - Runs the Python agent checks and the app regression harness together

## Testing Workflow

The first testing slice uses a lightweight two-layer setup:

- Playwright for executable browser checks on the app shell
- BDD-style feature files for readable acceptance scenarios

Key paths:

- `apps/app/tests/features` - human-readable feature scenarios
- `apps/app/tests/e2e` - executable Playwright specs and shared fixtures
- `apps/app/tests/README.md` - mapping rules between scenarios and specs

Typical local flow:

```bash
pnpm test:app:e2e:install
pnpm test:agent
pnpm test:app:e2e
```

## Documentation

The main UI component is in `src/app/page.tsx`. You can:
- Modify the theme colors and styling
- Add new frontend actions
- Customize the CopilotKit sidebar appearance

## 📚 Documentation

- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/) - Learn more about LangGraph and its features
- [CopilotKit Documentation](https://docs.copilotkit.ai) - Explore CopilotKit's capabilities

## Contributing

Feel free to submit issues and enhancement requests! This starter is designed to be easily extensible.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting

### Agent Connection Issues
If you see "I'm having trouble connecting to my tools", make sure:
1. The LangGraph agent is running on port 8000
2. Your OpenAI API key is set correctly
3. Both servers started successfully

### Python Dependencies
If you encounter Python import errors:
```bash
pnpm install
```

### Missing Local Package Binaries
If you see errors like `sh: next: command not found` even though the dependency is listed in `apps/app/package.json`, rebuild the pnpm links:
```bash
pnpm run repair:deps
```
