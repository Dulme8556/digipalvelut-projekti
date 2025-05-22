import { render, fireEvent, screen } from '@testing-library/svelte';
import Addnew from './add-new.svelte'
describe('Svelte Addnew Tests', () => {
  
  test('should render the Addnew', () => {
    render(Addnew);

    expect(screen.getByText(/CREATE NEW INDICATOR/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Expected value/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Start value/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Result value/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Unit/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Deadline/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Responsibility/i)).toBeInTheDocument();

    expect(screen.getByText(/Create indicator/i)).toBeInTheDocument();
  });

  test('should add new indicator and clear the fields', async () => {
    render(Addnew);

    const nameInput = screen.getByPlaceholderText(/Name/i);
    const expectedInput = screen.getByPlaceholderText(/Expected value/i);
    const startInput = screen.getByPlaceholderText(/Start value/i);
    const resultInput = screen.getByPlaceholderText(/Result value/i);
    const unitInput = screen.getByPlaceholderText(/Unit/i);

    await fireEvent.input(nameInput, { target: { value: 'Test Indicator' } });
    await fireEvent.input(expectedInput, { target: { value: 100 } });
    await fireEvent.input(startInput, { target: { value: 10 } });
    await fireEvent.input(resultInput, { target: { value: 90 } });
    await fireEvent.input(unitInput, { target: { value: 'kg' } });
    const button = screen.getByText(/Create indicator/i);
    await fireEvent.click(button);

    expect(nameInput.value).toBe('');
    expect(expectedInput.value).toBe('');
    expect(startInput.value).toBe('');
    expect(resultInput.value).toBe('');
    expect(unitInput.value).toBe('');
  });

  test('should not add an indicator when certain fields are empty', async () => {
    render(Addnew);

    const button = screen.getByText(/Create indicator/i);

    await fireEvent.click(button);

    expect(window.alert).toHaveBeenCalledWith("Can't add empty");
  });

  test('calculate percentage correctly', async () => {
    render(Addnew);

    const expectedInput = screen.getByPlaceholderText(/Expected value/i);
    const resultInput = screen.getByPlaceholderText(/Result value/i);
    
    await fireEvent.input(expectedInput, { target: { value: 100 } });
    await fireEvent.input(resultInput, { target: { value: 80 } });

    const instance = screen.getByTestId('Addnew-instance');
    instance.percentCalculation();

    expect(instance.newPercent).toBe('80');
  });
});
