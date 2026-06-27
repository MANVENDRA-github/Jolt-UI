import { render } from '@testing-library/react';
import { Hello } from './Hello';

describe('Hello (react)', () => {
  it('renders the greeting with the default name', () => {
    const { container } = render(<Hello />);
    expect(container.textContent).toBe('Hello World from React');
  });

  it('renders a custom name', () => {
    const { container } = render(<Hello name="Jolt UI" />);
    expect(container.textContent).toBe('Hello Jolt UI from React');
  });
});
