# :robot: a11y-ai

[![NPM version](https://img.shields.io/npm/v/a11y-ai.svg)](https://www.npmjs.com/package/a11y-ai)
[![Build Status](https://github.com/sinedied/a11y-ai/workflows/build/badge.svg)](https://github.com/sinedied/a11y-ai/actions)
![Node version](https://img.shields.io/node/v/a11y-ai.svg)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> Experimental tool to automatically detect accessibility issues in web pages using OpenAI and provide suggestions for fixing them.

![a11y-ai portrait by another AI](https://user-images.githubusercontent.com/593151/221144683-af658535-500b-4024-afe9-032526b3eec9.png)

*Can I help fixing your a11y issues?*

## Installation

```bash
npm install -g a11y-ai
```

## Usage

```
Usage: a11y <command> <files> [options]

If no files are specified, it will scan the current directory and
subdirectories for HTML files.

Commands:
  s, scan                     Scan files or URLs for accessibility issues

  f, fix                      Fix accessibility issues interactively
    -i, --issues <issues>     Comma-separated list of issues to fix (disable scan)
    -s, --chunk-size <tokens> Set input chunk size (default: 1000)
    -c, --char-diff           Use character diff instead of patch-like diff
    -y, --yes                 Apply fixes without prompting
    --context <context>       Provide additional context
    --gpt-diff                Make AI generate diff of fixes (experimental)

  r, report                   Generate a report of issues with fix suggestions
    -i, --issues <issues>     Comma-separated list of issues to fix (disable scan)
    -s, --chunk-size <tokens> Set input chunk size (default: 1000)
    -o, --format <format>     Report format [html, md] (default: html)
    --context <context>       Provide additional context
    --gpt-diff                Make AI generate diff of fixes (experimental)

General options:
  --api                   Use specified API URL
  --verbose               Show detailed logs
  --help                  Show this help
```

You can also set the API URL using the `A11Y_AI_API` environment variable.

### Examples

- Interactively scan & fix a local file:

  ```bash
  a11y fix site.html
  ```

- Generate a report of issues with fix suggestions for multiple URLs:

  ```bash
  a11y report https://microsoft.com https://docs.microsoft.com
  ```

- Interactively fix specific issues with additional context:

  ```bash
  a11y fix doc.html \
    --issues "Add missing images alt attributes" \
    --context "This is a documentation where screenshots shows the different step to setup GitHub Copilot on your account" 
  ```

- Automagicically scan for all HTML files in the current directory and subdirectories, interactively fix the issues:

  ```bash
  a11y
  ```

## Troubleshooting

WIP

<!-- ## Automated reports

You can generate a report of all the issues found in your project automatically on your CI/CD using this GitHub Action: [sinedied/a11y-ai-action](https://github.com/sinedied/a11y-ai-action)

You can see a complete [example workflow](https://github.com/sinedied/a11y-ai/blob/main/.github/workflows/action.yml) in action on this repository. -->

## Limitations

- Windows support outside of WSL2 is currently not working due to a bug in Axe CLI (WIP)
- It needs a matching Chrome version to work (WIP)
- Issue scanning is only supported for HTML files, not for JS/TS components (but fixing is supported)
- `--gpt-diff` options is experimental and may not work well in some cases
