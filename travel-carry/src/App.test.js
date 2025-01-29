import { render, screen } from '@testing-library/react';
import AppOumar from './AppOumar';

test('renders learn react link', () => {
  render(<AppOumar />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
