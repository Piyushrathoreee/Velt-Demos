import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'off',
    },
  },
];
