import type { Result } from '../../types';

interface ParsedDataset {
  rows: unknown[];
  totalRows: number;
  metadata: {
    schema?: Record<string, unknown>;
    hasHeaders: boolean;
  };
}

export const parseDataset = (content: string): Result<ParsedDataset> => {
  try {
    const data = JSON.parse(content);
    
    if (!Array.isArray(data)) {
      return {
        ok: false,
        error: new Error('Content must be an array of objects')
      };
    }
    
    if (data.length === 0) {
      return {
        ok: false,
        error: new Error('Dataset is empty')
      };
    }

    // Infer schema from first row
    const schema = Object.keys(data[0]).reduce((acc, key) => ({
      // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
      ...acc,
      [key]: typeof data[0][key]
    }), {});

    return {
      ok: true,
      value: {
        rows: data,
        totalRows: data.length,
        metadata: {
          schema,
          hasHeaders: true
        }
      }
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error('Failed to parse JSON')
    };
  }
};
