import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import { globalIgnores } from 'eslint/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base configuration
const baseConfig = [
  globalIgnores(['dist', 'node_modules', 'build', '.next']),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: [
          './tsconfig.json',
          './tsconfig.node.json',
          './tsconfig.app.json',
          './tsconfig.vitest.json',
        ],
        tsconfigRootDir: __dirname,
        projectFolderIgnoreList: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.next/**'],
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'simple-import-sort': eslintPluginSimpleImportSort,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...(reactRefresh.configs.vite?.rules || {}),
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            ['^node:'],
            ['^react', '^type:react'],
            ['^@?\\w', '^type:@?\\w'],
            ['^@/components/', '^type:@/components/'],
            ['^@/layouts/', '^type:@/layouts/'],
            ['^@/pages/', '^type:@/pages/'],
            ['^@/routes/', '^type:@/routes/'],
            ['^@/services/', '^type:@/services/'],
            ['^@/queries/', '^type:@/queries/'],
            ['^@/utils/', '^type:@/utils/'],
            ['^@/customTypes/', '^type:@/customTypes/'],
            ['^@/'],
            ['^\\.', '^type:\\.'],
            ['^type:'],
          ],
        },
      ],
    },
  },
];

// TypeScript specific config
export default tseslint.config(...baseConfig, {
  extends: [js.configs.recommended, ...tseslint.configs.recommended],
});
