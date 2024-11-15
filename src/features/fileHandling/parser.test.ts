import type { TextDocument } from 'vscode';
import { parseDataset } from './parser';

// Mock TextDocument since we can't use vscode API directly in tests
const mockTextDocument = (content: string): TextDocument => ({
  getText: () => content,
  lineCount: content.split('\n').length,
  lineAt: (line: number) => ({
    text: content.split('\n')[line],
  }),
});

describe('parseDataset', () => {
  it('should successfully parse valid JSON array', () => {
    const content = mockTextDocument(JSON.stringify([
      { id: 1, name: 'Test' },
      { id: 2, name: 'Test 2' }
    ], null, 2));

    const result = parseDataset(content);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.totalRows).toBe(2);
      expect(result.value.rows).toHaveLength(2);
      expect(result.value.metadata.schema).toEqual({
        id: 'number',
        name: 'string'
      });
      expect(result.value.metadata.hasHeaders).toBe(true);
    }
  });

  it('should handle empty array', () => {
    const content = mockTextDocument('[]');
    const result = parseDataset(content);

    expect(result.ok).toBe(false);
    expect(result.error?.message).toBe('Dataset is empty');
  });

  it('should handle invalid JSON', () => {
    const content = mockTextDocument('invalid json');
    const result = parseDataset(content);

    expect(result.ok).toBe(false);
    expect(result.error?.message).toBe('Failed to parse JSON');
  });

  it('should handle non-array JSON', () => {
    const content = mockTextDocument('{"key": "value"}');
    const result = parseDataset(content);

    expect(result.ok).toBe(false);
    expect(result.error?.message).toBe('Content must be an array of objects');
  });

  it('should correctly identify object ranges in multi-line JSON', () => {
    const jsonContent = `[
      {
        "id": 1,
        "name": "Test 1"
      },
      {
        "id": 2,
        "name": "Test 2"
      }
    ]`;

    const content = mockTextDocument(jsonContent);
    const result = parseDataset(content);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.positions).toEqual([
        { startLine: 1, endLine: 5 },
        { startLine: 6, endLine: 10 }
      ]);
    }
  });

  it('should handle nested objects', () => {
    const jsonContent = `[
      {
        "id": 1,
        "nested": {
          "key": "value"
        }
      }
    ]`;

    const content = mockTextDocument(jsonContent);
    const result = parseDataset(content);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.positions).toEqual([
        { startLine: 1, endLine: 7 }
      ]);
    }
  });
});