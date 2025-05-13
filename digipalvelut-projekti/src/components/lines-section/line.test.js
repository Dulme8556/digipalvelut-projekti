import { render } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import line from './line.svelte';

describe('line component', () => {
  it('runs with correct props', () => {
    const { getByText } = render(line, {
      props: {
        name: 'Test line',
        expected: 100,
        result: 50,
        start: 0,
        unit: '%',
        check: false,
        deadline: '',
        responsibility: '',
        function: vi.fn(),
        // "mock" function, check if the correct function was called
        update: vi.fn(),
        id: 1
      },
      context: new Map([
        ['list', { list: [], selectedValues: [] }]
      ])
    });

    expect(getByText('Test line')).toBeTruthy();
    expect(getByText('100')).toBeTruthy();
    expect(getByText('50')).toBeTruthy();
    expect(getByText('%')).toBeTruthy();
  });

  it('runs with correct props 2', () => {
    const { getByText } = render(line, {
      props: {
        name: 'Test line',
        expected: 100000,
        result: 503200,
        start: 32103,
        unit: 'People',
        check: false,
        deadline: '',
        responsibility: '',
        function: vi.fn(),
        // "mock" function, check if the correct function was called
        update: vi.fn(),
        id: 1
      },
      context: new Map([
        ['list', { list: [], selectedValues: [] }]
      ])
    });

    expect(getByText('Test line')).toBeTruthy();
    expect(getByText('100000')).toBeTruthy();
    expect(getByText('503200')).toBeTruthy();
    expect(getByText('People')).toBeTruthy();
  });
});
