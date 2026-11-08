import type { Preview } from '@storybook/react';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'cosmos-dark',
      values: [
        { name: 'cosmos-dark', value: '#07080D' },
        { name: 'editorial-midnight', value: '#131726' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
