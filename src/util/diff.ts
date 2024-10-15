import chalk from 'chalk';
import createDebug from 'debug';
import { applyPatch, createPatch, diffChars, parsePatch } from 'diff';

const debug = createDebug('diff');
const fuzzFactor = 1000;

export function generateColoredDiff(content: string, suggestion: string) {
  const diff = diffChars(content, suggestion);
  let coloredDiff = '';
  for (const part of diff) {
    if (part.added) {
      coloredDiff += chalk.green(part.value);
    } else if (part.removed) {
      coloredDiff += chalk.red(part.value);
    } else {
      coloredDiff += part.value;
    }
  }

  return coloredDiff.trim();
}

export function applyPatchDiff(content: string, suggestion: string, isDiff = false) {
  if (!isDiff) {
    return suggestion;
  }

  // Fix patch format when needed as GPT tends to add diff commands before the patch
  if (!suggestion.startsWith('---')) {
    debug(`Received patch needs fixing`);
    const startIndex = suggestion.indexOf('---');
    suggestion = suggestion.slice(startIndex);
  }

  let finalSuggestion = content;
  const patches = parsePatch(suggestion);
  debug(`Found ${patches.length} patch(es) to apply`);

  if (patches.length === 0) {
    throw new Error(`Could not parse patch suggestion`);
  } else {
    for (const patch of patches) {
      const patchedResult = applyPatch(finalSuggestion, patch, { fuzzFactor });
      if (patchedResult !== false) {
        finalSuggestion = patchedResult;
        debug(`Applied patch`);
      } else {
        if (createDebug.enabled('diff')) {
          console.log(`Original code:------------------\n${content}`);
          console.log(`Suggestion:---------------------\n${suggestion}`);
        }

        throw new Error(`Could not apply patch suggestion: invalid format`);
      }
    }
  }

  return finalSuggestion;
}

export function generatePatchDiff(file: string, content: string, suggestion: string, colors = true) {
  let diff = createPatch(file, content, suggestion);
  // Remove header
  diff = diff
    .split(/={10,}/)
    .slice(1)
    .join('')
    .trim();

  if (colors) {
    diff = diff
      .split('\n')
      .map((line) => {
        switch (line[0]) {
          case '+': {
            return line.startsWith('+++') ? line : chalk.green(line);
          }

          case '-': {
            return line.startsWith('---') ? line : chalk.red(line);
          }

          case '@': {
            return chalk.cyan(line);
          }

          case '\\': {
            return chalk.dim(line);
          }

          default: {
            return line;
          }
        }
      })
      .join('\n')
      .trim();
  }

  return diff;
}

export function patchOriginalContent(file: string, content: string, processedContent: string, suggestion: string) {
  const patch = createPatch(file, processedContent, suggestion);
  const patchedContent = applyPatch(content, patch, { fuzzFactor });
  if (!patchedContent) {
    throw new Error(`Could not patch original content with suggestion`);
  }

  return patchedContent;
}
