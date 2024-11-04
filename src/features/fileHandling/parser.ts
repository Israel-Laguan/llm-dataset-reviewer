import { TextDocument } from 'vscode';
import type { Position, Result } from '../../types';

interface ParsedDataset {
  positions: Position[];
  rows: unknown[];
  totalRows: number;
  metadata: {
    schema?: Record<string, unknown>;
    hasHeaders: boolean;
  };
}

function findArrayItemRanges(document: TextDocument) {
  let rows = [];
  const lineCount = document.lineCount;

  let bracketCount = 0;
  let itemStart: number | null = null;

  // Scan through each line
  for (let lineNum = 0; lineNum < lineCount; lineNum++) {
    const line = document.lineAt(lineNum).text.trim();

    // Count opening and closing brackets
    for (const char of line) {
      if (char === '{') {
        if (bracketCount === 0) {
          itemStart = lineNum;
        }
        bracketCount++;
      } else if (char === '}') {
        bracketCount--;
        if (bracketCount === 0 && itemStart !== null) {
          // We've found a complete object
          rows.push({
            startLine: itemStart,
            endLine: lineNum + 1,
          });
          itemStart = null;
        }
      }
    }
  }

  return rows;
}

export const parseDataset = (content: TextDocument): Result<ParsedDataset> => {
  try {
    const data = JSON.parse(content.getText());

    if (!Array.isArray(data)) {
      return {
        ok: false,
        error: new Error('Content must be an array of objects'),
      };
    }

    if (data.length === 0) {
      return {
        ok: false,
        error: new Error('Dataset is empty'),
      };
    }

    // Infer schema from first row
    const schema = Object.keys(data[0]).reduce(
      (acc, key) => ({
        // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
        ...acc,
        [key]: typeof data[0][key],
      }),
      {}
    );

    const positions = findArrayItemRanges(content);

    return {
      ok: true,
      value: {
        rows: data,
        positions,
        totalRows: data.length,
        metadata: {
          schema,
          hasHeaders: true,
        },
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error('Failed to parse JSON'),
    };
  }
};
