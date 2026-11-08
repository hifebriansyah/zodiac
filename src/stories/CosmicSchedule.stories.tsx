import type { Meta, StoryObj } from '@storybook/react';
import { CosmicSchedule } from '../components/CosmicSchedule';
import { buildFallbackReading } from '../data/zodiacMeta';

const sampleData = buildFallbackReading('aries', 'builder', 'leader', '20261109');

const meta: Meta<typeof CosmicSchedule> = {
  title: 'ASTRAEA/CosmicSchedule',
  component: CosmicSchedule,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CosmicSchedule>;

export const DailyTimelineWithSynastry: Story = {
  args: {
    signId: 'aries',
    dateLabel: 'Senin, 9 November 2026',
    routine: sampleData.routine,
    partnerSignId: 'libra',
    partnerRoutine: sampleData.synastries.find((s) => s.sign === 'libra')?.routine,
  },
};
