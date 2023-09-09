// See https://www.npmjs.com/package/@rushstack/eslint-patch
require('@rushstack/eslint-patch/modern-module-resolution')

const off = 'off'
const error = 'error'

module.exports = {
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      settings: { 'import/resolver': 'typescript', react: { version: 'detect' } },
      parserOptions: {
        project: './tsconfig.json',
      },
      plugins: ['etc'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        // Prettier must be last as it disables all stylistic
        // rules setup by the previous presets
        'prettier',
      ],
      rules: {
        'no-constant-condition': [error, { checkLoops: false }],
        'import/no-cycle': error,
        'import/no-named-as-default-member': off,
        '@typescript-eslint/no-misused-promises': error,
        '@typescript-eslint/no-floating-promises': error,
        '@typescript-eslint/no-explicit-any': error,
        '@typescript-eslint/explicit-module-boundary-types': error,
        '@typescript-eslint/no-unused-vars': [
          error,
          {
            args: 'none',
          },
        ],
        'prefer-object-has-own': error,
        'import/no-relative-packages': error,
        'import/no-extraneous-dependencies': error,
        'react-hooks/exhaustive-deps': [
          error,
          {
            additionalHooks: 'useAsyncCallback',
          },
        ],
        'react/react-in-jsx-scope': off,
        'react/prop-types': off,
        'react/no-unknown-property': [error, { ignore: ['css'] }],
      },
    },
    {
      files: ['*.md', '*.mdx'],
      extends: ['plugin:mdx/recommended'],
      settings: {
        'mdx/code-blocks': true,
      },
    },
  ],
  rules: {
    'prefer-object-has-own': 'off', // This rule is valid for ES2022, but we target ES2019
    'import/no-relative-parent-imports': 'off',
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'react-redux',
            importNames: ['useSelector', 'useDispatch'],
            message: 'Please use `useAppSelector` and `useAppDispatch` instead',
          },
        ],
      },
    ],
  },
}
