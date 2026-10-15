import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/shared'],
};

export default withPayload(nextConfig);
