# ReadmeHub

![Build](https://img.shields.io/badge/build-passing-2563eb)
![README](https://img.shields.io/badge/readme-ready-0f766e)
![License](https://img.shields.io/badge/license-MIT-2f855a)
![Contributors](https://img.shields.io/badge/contributors-welcome-f59e0b)

[Chinese](README.md) · [English](README.en.md)

Turn existing open-source projects into README files that can be understood in 10 minutes.

[Research Review](docs/research-review.md) · [Agent Usage](docs/agent-usage.md) · [Quick Start](#quick-start) · [Features](#features) · [Contributing](#contributing) · [License](#license) · [Star History](#star-history)

## Positioning

ReadmeHub is a README assistant for existing open-source projects. It turns project facts, setup paths, screenshots or GIFs, differentiators, community links, and AI handoff notes into a GitHub-friendly README, with structured review before generation.

| Status | Audience | Main Use Cases | Stack |
| --- | --- | --- | --- |
| Experimental | Open-source maintainers, indie developers, technical creators | Publishing a project, rewriting a README, submitting to awesome lists | React + TypeScript + Vite |

## Features

- Project fact form: collect positioning, audience, scenarios, setup, visuals, and contribution paths.
- README quality review: evaluate positioning, GitHub search readability, quick start, visual evidence, structure, differentiation, community trust, and language consistency.
- Standard structure: Navigation, Logo/Slogan, Badges, Quick Install, What is this, GIF, X vs Y, AI Usage, Docs, Contributing, License, and Star History.
- AI usage section: generate handoff prompts, suitable tasks, and safety boundaries for Codex, Claude Code, Cursor Agent, and similar agents.
- Bilingual output: keep `README.md` as the default Chinese version and provide `README.en.md` as the English version.
- Star History chart: show the project's growth signal at the bottom of the README.
- Markdown generation: preview, source view, copy, and download a GitHub-friendly README.

## Standard Writing Flow

1. Start with the project name, one-line positioning, badges, and navigation.
2. Prepare two language versions: Chinese `README.md` by default, with English in `README.en.md`; both should link to each other.
3. Add the project facts table: status, audience, main scenarios, and stack.
4. Explain features, quick start, and visual evidence so readers can understand or run the project in 10 minutes.
5. Add an `AI Usage` section so agents know what to read, what they can do, and which actions require human confirmation.
6. Add differentiation, docs, contribution notes, and License.
7. Put the Star History chart at the bottom as a visible community signal.

## Quick Start

Requirements:

- Node.js 20+
- npm 10+

Clone the repository:

```bash
git clone https://github.com/clenji/readmehub.git
cd readmehub
```

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Recommended checks before committing:

```bash
npm run lint
npm run build
```

## AI Usage

Use this prompt when asking an agent to apply ReadmeHub standards to another project:

```text
Use the README standard in /Users/lishu/Documents/projects/readmehub to improve the README for <target-project-path>.

Requirements:
- Read readmehub/README.md, readmehub/README.en.md, docs/research-review.md, docs/agent-usage.md, and the buildGeneratedReadme/buildAudit logic in src/App.tsx first.
- Then read the target project's README, config files, scripts, docs, and test entry points. Rewrite based on facts; do not invent features.
- The README must include: project name, badges, one-line positioning, navigation, project facts table, features, quick start, usage flow, AI Usage, why this project, project structure, docs, contribution or maintenance notes, License, and Star History.
- Use Chinese README.md as the default and also prepare README.en.md in English. The two files should link to each other.
- If the project involves medical, financial, credential, personal, or local runtime data, document safety boundaries and files that must not be committed.
- Run git diff --check after editing. If the target project has clear test or build commands, run the smallest relevant verification.
- Commit and push only when I explicitly ask.
```

See [docs/agent-usage.md](docs/agent-usage.md) for the full agent workflow.

## Why ReadmeHub

| Dimension | Common Approach | ReadmeHub |
| --- | --- | --- |
| Source of truth | Copy a template and fill blanks | Start from project facts, then generate |
| Quality review | Check only whether Markdown exists | Review the actual first-time reading path |
| Visual evidence | Screenshots and GIFs are often forgotten | Treat visual proof as a review item |
| AI handoff | Re-explain the project every time | Provide agent entry points, tasks, and boundaries |
| Bilingual docs | Mix Chinese and English in one README | Chinese `README.md` by default, English `README.en.md` |
| Community signal | Show only current star count | Show the Star History chart at the bottom |

## Project Structure

```text
readmehub/
  README.md
  README.en.md
  docs/
    agent-usage.md
    research-review.md
  LICENSE
  src/
    App.tsx
    App.css
    index.css
```

## Contributing

The README structure, content skeleton, and open-source presentation ideas in this project are based on [Feynman Zhou](https://github.com/FeynmanZhou)'s talk at DEV.TOGETHER2021 China Developer Ecosystem Summit, then organized into a local tool.

Contributions are welcome, especially:

- New README review rules.
- Templates for CLI tools, libraries, web apps, models, datasets, and awesome lists.
- Better Chinese and English generation strategies.
- GitHub repository scanning and link checks.

## License

MIT

## Star History

<a href="https://www.star-history.com/#clenji/readmehub&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=clenji%2Freadmehub&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=clenji%2Freadmehub&type=Date" />
    <img alt="clenji/readmehub Star History Chart" src="https://api.star-history.com/svg?repos=clenji%2Freadmehub&type=Date" />
  </picture>
</a>
