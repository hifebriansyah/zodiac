import type { Meta, StoryObj } from '@storybook/react';
import { StoryShareModal } from '../components/StoryShareModal';
import { buildFallbackReading } from '../data/zodiacMeta';

const sampleData = buildFallbackReading('leo', 'executive', 'leader', '20261109');

const meta: Meta<typeof StoryShareModal> = {
  title: 'ASTRAEA/StoryShareModal',
  component: StoryShareModal,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StoryShareModal>;

export const VerticalSocialCard: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    signId: 'leo',
    dateLabel: 'Senin, 9 November 2026',
    readingData: sampleData,
  },
};
