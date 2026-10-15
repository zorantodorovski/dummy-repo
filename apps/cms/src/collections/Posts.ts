import { slugify } from '@repo/shared/utils';
import type { ContentStatus } from '@repo/shared/types';
import type { CollectionConfig } from 'payload';

const defaultStatus: ContentStatus = 'draft';

export const Posts: CollectionConfig = {
  slug: slugify('Posts'),
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: defaultStatus,
      options: ['draft', 'published'],
      required: true,
    },
  ],
};
