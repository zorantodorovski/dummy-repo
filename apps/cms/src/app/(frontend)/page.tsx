import { formatGreeting } from '@repo/shared/utils';
import type { AppMetadata } from '@repo/shared/types';

const appMetadata: AppMetadata = {
  name: 'Dummy CMS',
  version: '1.0.0',
};

export default function HomePage() {
  return <main>{formatGreeting(appMetadata.name)}</main>;
}
