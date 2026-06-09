export const LOG_ENDPOINT = 'http://4.224.186.213/evaluation-service/logs';
export const TIMEOUT_MS = 10000;
export const ACCESS_TOKEN_ENV_VAR = 'ACCESS_TOKEN';

export const VALID_STACKS = ['backend', 'frontend'] as const;
export const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'] as const;

export const BACKEND_PACKAGES = [
  'cache',
  'controller',
  'cron_job',
  'db',
  'domain',
  'handler',
  'repository',
  'route',
  'service'
] as const;

export const FRONTEND_PACKAGES = [
  'api',
  'component',
  'hook',
  'page',
  'state',
  'style'
] as const;

export const SHARED_PACKAGES = ['auth', 'config', 'middleware', 'utils'] as const;
