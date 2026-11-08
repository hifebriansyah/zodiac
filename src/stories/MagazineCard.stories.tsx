import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MagazineCard } from '../components/MagazineCard';
import { buildFallbackReading } from '../data/zodiacMeta';

const meta: Meta<typeof MagazineCard> = {
  title: 'ASTRAEA/MagazineCard',
  component: MagazineCard,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="max-w-md p-4">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MagazineCard>;

export const ScorpioFeatured: Story = {
  args: {
    signId: 'scorpio',
    readingData: buildFallbackReading('scorpio', 'builder', 'professional', '20261109'),
    issueNumber: 8,
    isFeatured: true,
    isPlayingAudio: false,
  },
};

export const LeoAudioPlaying: Story = {
  args: {
    signId: 'leo',
    readingData: buildFallbackReading('leo', 'executive', 'leader', '20261109'),
    issueNumber: 5,
    isFeatured: false,
    isPlayingAudio: true,
  },
};
