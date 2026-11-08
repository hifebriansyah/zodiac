import type { Meta, StoryObj } from '@storybook/react';
import { SocialRadar } from '../components/SocialRadar';
import { buildFallbackReading } from '../data/zodiacMeta';

const sampleData = buildFallbackReading('pisces', 'explorer', 'independent', '20261109');

const meta: Meta<typeof SocialRadar> = {
  title: 'ASTRAEA/SocialRadar',
  component: SocialRadar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SocialRadar>;

export const SynastryMatrix12x7: Story = {
  args: {
    signId: 'pisces',
    synastries: sampleData.synastries,
    selectedPartnerSign: 'scorpio',
  },
};
