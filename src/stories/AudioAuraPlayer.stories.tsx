import type { Meta, StoryObj } from '@storybook/react';
import { AudioAuraPlayer } from '../components/AudioAuraPlayer';
import { buildFallbackReading } from '../data/zodiacMeta';

const sampleData = buildFallbackReading('taurus', 'builder', 'professional', '20261109');

const meta: Meta<typeof AudioAuraPlayer> = {
  title: 'ASTRAEA/AudioAuraPlayer',
  component: AudioAuraPlayer,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AudioAuraPlayer>;

export const TaurusHarmonicAura: Story = {
  args: {
    signId: 'taurus',
    mood: sampleData.mood,
    luckyColor: sampleData.lucky_color,
    narrationText: sampleData.reading.general,
  },
};
