import {
  BACKEND_PACKAGES,
  FRONTEND_PACKAGES,
  SHARED_PACKAGES,
  VALID_LEVELS,
  VALID_STACKS
} from './constants';
import { LoggerError } from './errors';
import type { Level, PackageName, Stack } from './logger';

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function buildAllowedPackages(stack: Stack): readonly PackageName[] {
  return stack === 'backend'
    ? [...BACKEND_PACKAGES, ...SHARED_PACKAGES]
    : [...FRONTEND_PACKAGES, ...SHARED_PACKAGES];
}

export function validateStack(stack: unknown): asserts stack is Stack {
  if (!isNonEmptyString(stack) || !VALID_STACKS.includes(stack as Stack)) {
    throw new LoggerError(`Invalid stack. Allowed values: ${VALID_STACKS.join(', ')}.`);
  }
}

export function validateLevel(level: unknown): asserts level is Level {
  if (!isNonEmptyString(level) || !VALID_LEVELS.includes(level as Level)) {
    throw new LoggerError(`Invalid level. Allowed values: ${VALID_LEVELS.join(', ')}.`);
  }
}

export function validatePackageName(stack: Stack, packageName: unknown): asserts packageName is PackageName {
  if (!isNonEmptyString(packageName)) {
    throw new LoggerError('package must be a non-empty string.');
  }

  const allowedPackages = buildAllowedPackages(stack);

  if (!allowedPackages.includes(packageName as PackageName)) {
    throw new LoggerError(`Invalid package for ${stack}. Allowed values: ${allowedPackages.join(', ')}.`);
  }
}

export function validateMessage(message: unknown): asserts message is string {
  if (!isNonEmptyString(message)) {
    throw new LoggerError('message must be a non-empty string.');
  }
}
