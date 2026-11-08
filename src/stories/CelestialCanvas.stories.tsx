import type { Meta, StoryObj } from '@storybook/react';
import { CelestialCanvas } from '../components/CelestialCanvas';

const meta: Meta<typeof CelestialCanvas> = {
  title: 'ASTRAEA/CelestialCanvas',
  component: CelestialCanvas,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CelestialCanvas>;

export const Interactive3DMedallion: Story = {
  args: {
    activeSign: 'leo',
    vibeScore: 9,
    mode: 'medallion',
    className: 'h-80 w-full rounded-3xl border border-gold-400/30 bg-cosmos-950',
  },
};
