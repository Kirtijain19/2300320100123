import axios, { AxiosError, AxiosInstance } from 'axios';
import { ACCESS_TOKEN_ENV_VAR, LOG_ENDPOINT, TIMEOUT_MS } from './constants';
import { LoggerError } from './errors';
import { validateLevel, validateMessage, validatePackageName, validateStack } from './validators';

export type Stack = 'backend' | 'frontend';
export type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export type BackendPackage =
  | 'cache'
  | 'controller'
  | 'cron_job'
  | 'db'
  | 'domain'
  | 'handler'
  | 'repository'
  | 'route'
  | 'service';

export type FrontendPackage =
  | 'api'
  | 'component'
  | 'hook'
  | 'page'
  | 'state'
  | 'style';

export type SharedPackage = 'auth' | 'config' | 'middleware' | 'utils';
export type PackageName = BackendPackage | FrontendPackage | SharedPackage;

export interface LogRequest {
  stack: Stack;
  level: Level;
  packageName: PackageName;
  message: string;
}

export interface LogResponse {
  success: boolean;
  status: number;
  logID: string;
}

function resolveAccessToken(): string {
  const token = process.env[ACCESS_TOKEN_ENV_VAR];

  if (!isNonEmptyString(token)) {
    throw new LoggerError(`Missing access token. Set ${ACCESS_TOKEN_ENV_VAR}.`);
  }

  return token.trim();
}

function createClient(): AxiosInstance {
  const accessToken = resolveAccessToken();

  return axios.create({
    baseURL: LOG_ENDPOINT,
    timeout: TIMEOUT_MS,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
}

function toLoggerError(error: unknown): LoggerError {
  if (error instanceof LoggerError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const responseBody = axiosError.response?.data;
    const responseDetails = status ? ` Status: ${status}.` : '';
    const payloadDetails = responseBody ? ` Response: ${JSON.stringify(responseBody)}.` : '';

    return new LoggerError(`Log request failed.${responseDetails}${payloadDetails}`);
  }

  if (error instanceof Error) {
    return new LoggerError(error.message);
  }

  return new LoggerError('Unknown logging error.');
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizeLogResponse(response: { status: number; data: unknown }): LogResponse {
  const responseData = response.data as { logID?: unknown; logId?: unknown } | undefined;
  const logID = responseData?.logID ?? responseData?.logId;

  if (!isNonEmptyString(logID)) {
    throw new LoggerError('Log API response did not include logID.');
  }

  return {
    success: true,
    status: response.status,
    logID: logID.trim()
  };
}

export async function Log(
  stack: Stack,
  level: Level,
  packageName: PackageName,
  message: string
): Promise<LogResponse> {
  try {
    validateStack(stack);
    validateLevel(level);
    validatePackageName(stack, packageName);
    validateMessage(message);

    const client = createClient();
    const response = await client.post('', {
      stack,
      level,
      package: packageName,
      message: message.trim()
    });

    return normalizeLogResponse(response);
  } catch (error) {
    throw toLoggerError(error);
  }
}

export async function LogInfo(
  stack: Stack,
  packageName: PackageName,
  message: string
): Promise<LogResponse> {
  return Log(stack, 'info', packageName, message);
}

export async function LogWarn(
  stack: Stack,
  packageName: PackageName,
  message: string
): Promise<LogResponse> {
  return Log(stack, 'warn', packageName, message);
}

export async function LogError(
  stack: Stack,
  packageName: PackageName,
  message: string
): Promise<LogResponse> {
  return Log(stack, 'error', packageName, message);
}
