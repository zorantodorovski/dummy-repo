import type { GlobalConfig } from 'payload';

export const LandingPage: GlobalConfig = {
  slug: 'landing-page',
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'subheading', type: 'textarea', required: true },
        { name: 'callToActionText', type: 'text' },
      ],
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'badge', type: 'text' },
      ],
    },
  ],
};
