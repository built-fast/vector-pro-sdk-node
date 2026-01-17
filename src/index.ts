// Main client
export { VectorProClient } from './client.js';

// Error handling
export { VectorProError, type ApiErrorResponse } from './errors.js';

// Types
export type {
  // Client configuration
  VectorProClientOptions,

  // Pagination
  PaginationParams,
  PaginatedResponse,

  // Sites
  Site,
  SiteStatus,
  CreateSiteRequest,
  UpdateSiteRequest,
  PasswordResetResponse,

  // Environments
  Environment,
  EnvironmentStatus,
  CreateEnvironmentRequest,
  UpdateEnvironmentRequest,
  EnvironmentPasswordResetResponse,

  // Deployments
  Deployment,
  DeploymentStatus,
  RollbackDeploymentRequest,

  // Secrets
  Secret,
  CreateSecretRequest,
  UpdateSecretRequest,

  // API Keys
  ApiKey,
  CreateApiKeyRequest,

  // SSH Keys
  SshKey,
  CreateSshKeyRequest,

  // Webhooks
  Webhook,
  WebhookType,
  CreateWebhookRequest,
  UpdateWebhookRequest,
  WebhookLog,

  // WAF
  AllowedReferrer,
  BlockedReferrer,
  BlockedIp,
  RateLimit,
  CreateRateLimitRequest,
  UpdateRateLimitRequest,

  // PHP Versions
  PhpVersion,

  // Events
  Event,

  // Logs
  LogColumn,
  LogTable,
  LogsResponse,
  GetLogsParams,

  // SSL
  SslStatus,
  NudgeSslRequest,

  // Cache
  PurgeCacheRequest,
  PurgeCacheResponse,
} from './types.js';
