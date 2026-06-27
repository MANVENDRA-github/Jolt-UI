import { render } from '@testing-library/svelte';
import Hello from './Hello.svelte';

describe('Hello (svelte)', () => {
  it('renders the greeting with the default name', () => {
    const { container } = render(Hello);
    expect(container.textContent).toBe('Hello World from Svelte');
  });

  it('renders a custom name', () => {
    const { container } = render(Hello, { props: { name: 'Jolt UI' } });
    expect(container.textContent).toBe('Hello Jolt UI from Svelte');
  });
});
