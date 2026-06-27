import { render } from '@testing-library/vue';
import Hello from './Hello.vue';

describe('Hello (vue)', () => {
  it('renders the greeting with the default name', () => {
    const { container } = render(Hello);
    expect(container.textContent).toBe('Hello World from Vue');
  });

  it('renders a custom name', () => {
    const { container } = render(Hello, { props: { name: 'Jolt UI' } });
    expect(container.textContent).toBe('Hello Jolt UI from Vue');
  });
});
