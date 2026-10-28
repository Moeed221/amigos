import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
export default defineConfig([...nextVitals, globalIgnores(['out/**','.next/**']), { rules: { '@next/next/no-img-element': 'off', '@next/next/no-html-link-for-pages': 'off', '@next/next/no-css-tags': 'off', 'react/no-unescaped-entities': 'off', 'react-hooks/immutability': 'off' } }]);
