module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js'],
      rules: {
        'jsx-quotes': ['error', 'prefer-single'],
        '@typescript-eslint/no-shadow': ['error'],
        '@typescript-eslint/quotes': [
          'error',
          'single',
          {
            avoidEscape: true,
            allowTemplateLiterals: true,
          },
        ],
        semi: ['error', 'never'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'import/order': [
          'error',
          {
            groups: ['builtin', 'external', 'internal'],
            pathGroups: [
              {
                pattern: 'react+(|-native)',
                group: 'external',
                position: 'before',
              },
            ],
            pathGroupsExcludedImportTypes: ['react'],
            'newlines-between': 'always',
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
          },
        ],
        'prettier/prettier': [
          'error',
          {
            singleQuote: true,
            jsxSingleQuote: true,
            trailingComma: 'none',
            arrowParens: 'avoid',
            endOfLine: 'auto',
            semi: false,
          },
        ],
      },
    },
  ],
}
