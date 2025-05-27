import { render, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FileReader from './file-reader.svelte';

describe('FileReader component', () => {

  test('adds item to list after file is uploaded', async () => {
    const { container } = render(FileReader);
    const input = container.querySelector('input[type="file"]');

    const fakeFile = new File([''], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    Object.defineProperty(fakeFile, 'arrayBuffer', {
      value: () => Promise.resolve(new ArrayBuffer(8))
    });

    await fireEvent.change(input, {
      target: { files: [fakeFile] },
    });

    await waitFor(() => {
      expect(mockListContext.list.length).toBe(1);
      expect(mockListContext.list[0].name).toBe('Task A');

    });
  });
});