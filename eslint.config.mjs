import expoConfig from 'eslint-config-expo/flat.js';

export default [
  ...expoConfig,
  {
    ignores: [
      '**/dist/**',
      '**/.next/**',
      '**/web-build/**',
      '**/node_modules/**',
      '**/next-env.d.ts',
    ],
  },
];
