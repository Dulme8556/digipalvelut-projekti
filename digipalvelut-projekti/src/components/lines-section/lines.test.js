import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import Lines from './lines.svelte';


describe('Lines', () => {

  test('should update searchquery when typing in the searchbar', async () => {
    render(Lines, {
      props: {
        lists: {
          selectedValues: [],
          list: [{ id: 1, name: 'Line 1' }, { id: 2, name: 'Line 2' }]
        }
      }
    });

    const searchInput = screen.getByPlaceholderText('Search indicators...');
    await fireEvent.input(searchInput, { target: { value: 'Line 1' } });

    expect(searchInput.value).toBe('Line 1');
  });



  test('should call selectAll function when selectall button is clicked', async () => {
    const selectAll = vi.fn();

    render(Lines, {
      props: {
        lists: {
          selectedValues: [],
          list: [{ id: 1, name: 'Line 1' }, { id: 2, name: 'Line 2' }]
        },
        selectAll
      }
    });

    const selectAllButton = screen.getByText('Select all');
    await fireEvent.click(selectAllButton);

    expect(selectAll).toHaveBeenCalled();
  });
});
