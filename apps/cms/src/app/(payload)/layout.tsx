import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts';
import config from '@payload-config';
import type { ReactNode } from 'react';

import { importMap } from './admin/importMap';

export default function PayloadLayout({ children }: { children: ReactNode }) {
  return (
    <RootLayout
      config={config}
      importMap={importMap}
      serverFunction={(args) => handleServerFunctions({ ...args, config, importMap })}
    >
      {children}
    </RootLayout>
  );
}
