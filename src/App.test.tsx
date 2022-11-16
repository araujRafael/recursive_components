import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const hi = screen.findByText(/Hi, Jhon/i);
  expect(hi).toBeTruthy()
});
