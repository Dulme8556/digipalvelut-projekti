import { render } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import line from './line.svelte';

describe('line component', () => {
  it('correct props test n.1', () => {
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

  it('correct props test n.2', () => {
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
  
  it('negative results test', () => {
    const { getByText } = render(line, {
      props: {
        name: 'Negative test',
        expected: 50,
        result: -10,
        start: -20,
        unit: '$',
        check: true,
        deadline: '2025-12-31',
        responsibility: 'Finance',
        function: vi.fn(),
        update: vi.fn(),
        id: 3
      },
      context: new Map([
        ['list', { list: [], selectedValues: [] }]
      ])
    });

    expect(getByText('Negative test')).toBeTruthy();
    expect(getByText('50')).toBeTruthy();
    expect(getByText('-10')).toBeTruthy();
    expect(getByText('$')).toBeTruthy();
  });

  
  it('deadline test', () => {
    const { getByText } = render(line, {
      props: {
        name: 'Deadline line',
        expected: 300,
        result: 250,
        start: 100,
        unit: 'hrs',
        check: true,
        deadline: '2025-08-20',
        responsibility: 'Dev Team',
        function: vi.fn(),
        update: vi.fn(),
        id: 4
      },
      context: new Map([
        ['list', { list: [], selectedValues: [] }]
      ])
    });

    expect(getByText('Deadline line')).toBeTruthy();
    expect(getByText('300')).toBeTruthy();
    expect(getByText('250')).toBeTruthy();
    expect(getByText('hrs')).toBeTruthy();
    expect(getByText('Dev Team')).toBeTruthy();
  });
});
