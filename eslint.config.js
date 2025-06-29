import antfu from '@antfu/eslint-config';

export default antfu(
  {
    formatters: true,
    ignores: [
      'public/',
      'ios/',
      'android/',
      'src/shared/ui/',
      'src/shared/utils.ts',
      '**/types',
      '**/cache',
      '**/dist',
      '**/.temp',
      '**/*.svg',
    ],
  },
  {
    rules: {
      'vue/max-attributes-per-line': ['error', {
        singleline: 1,
        multiline: 1,
      }],
      'style/semi': ['error', 'always'],
      'vue/no-deprecated-functional-template': 'off',
      'vue/one-component-per-file': 'off',
      'vue/no-template-shadow': 'off',
      'vue/require-prop-types': 'off',
      'spaced-comment': ['error', 'always', { exceptions: ['#__PURE__'] }],
      'ts/ban-types': 'off',
      'node/no-callback-literal': 'off',
      'import/namespace': 'off',
      'import/default': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'node/prefer-global/process': 'off',
      'ts/unified-signatures': 'off',
      'ts/no-dynamic-delete': 'off',
    },
  },
);
