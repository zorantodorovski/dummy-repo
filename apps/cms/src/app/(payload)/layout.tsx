import { RootLayout } from '@payloadcms/next/layouts';
import config from '@payload-config';
import type { ReactNode } from 'react';

import { importMap } from './admin/importMap';
import { serverFunction } from './serverFunction';

export default function PayloadLayout({ children }: { children: ReactNode }) {
  return (
    <RootLayout
      config={config}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  );
}
