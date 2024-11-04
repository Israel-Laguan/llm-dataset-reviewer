import type { Result, DatasetRow } from '../../types';

interface RowManagerState {
  currentIndex: number;
  rows: unknown[];
  totalRows: number;
}

export const createRowManager = (initialRows: unknown[], totalRows: number): RowManagerState => ({
  currentIndex: 0,
  rows: initialRows,
  totalRows
});

export const getCurrentRow = (state: RowManagerState): Result<DatasetRow> => {
  if (state.currentIndex >= state.totalRows) {
    return {
      ok: false,
      error: new Error('Current index out of bounds')
    };
  }

  return {
    ok: true,
    value: {
      content: state.rows[state.currentIndex],
      index: state.currentIndex,
      position: {
        line: state.currentIndex,
        character: 0
      }
    }
  };
};

export const navigateToRow = (
  state: RowManagerState,
  targetIndex: number
): Result<RowManagerState> => {
  if (targetIndex < 0 || targetIndex >= state.totalRows) {
    return {
      ok: false,
      error: new Error('Target index out of bounds')
    };
  }

  return {
    ok: true,
    value: {
      ...state,
      currentIndex: targetIndex
    }
  };
};

export const nextRow = (state: RowManagerState): Result<RowManagerState> => 
  navigateToRow(state, state.currentIndex + 1);

export const previousRow = (state: RowManagerState): Result<RowManagerState> => 
  navigateToRow(state, state.currentIndex - 1);