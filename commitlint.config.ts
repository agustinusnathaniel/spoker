/* eslint-disable import/no-extraneous-dependencies */
import { RuleConfigSeverity, type UserConfig } from '@commitlint/types';

const commitLintConfiguration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-case': [RuleConfigSeverity.Error, 'always', 'kebab-case'],
    'scope-enum': [
      RuleConfigSeverity.Error,
      'always',
      [
        'analytics',
        'auth',
        'hall',
        'layout',
        'pages',
        'room',
        'seo',
        'sentry',
        'services',
        'theme',
        'types',
        'ui',
        'utils',
        'security',
        'deps',
      ],
    ],
  },
};

export default commitLintConfiguration;
