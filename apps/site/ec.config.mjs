import { defineEcConfig } from 'astro-expressive-code';

// Expressive Code config lives here (not inline in astro.config) because
// `themeCssSelector` is a function and Astro can't serialize function options
// passed inline to the `<Code>` component.
export default defineEcConfig({
  themes: ['github-dark', 'github-light'],
  // Code blocks track the site theme: github-dark under [data-theme='dark'],
  // github-light under [data-theme='light'] (theme.type is 'dark' | 'light').
  themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
  // The site toggles [data-theme] manually; don't also switch on the OS setting.
  useDarkModeMediaQuery: false,
});
