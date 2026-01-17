// Client configuration
export interface VectorProClientOptions {
  apiKey: string;
  baseUrl?: string;
}

// Pagination
export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: Record<string, string | null>;
  meta: {
    current_page?: number;
    from?: number;
    last_page?: number;
    path?: string;
    per_page?: number;
    to?: number;
    total?: number;
  };
}

// Site types
export type SiteStatus = 'pending' | 'active' | 'suspended' | 'terminating' | 'terminated';

export interface Environment {
  id: string;
  vector_site_id: string;
  partner_customer_id?: string;
  name: string;
  is_production: boolean;
  status: EnvironmentStatus;
  provisioning_step?: string | null;
  failure_reason?: string | null;
  php_version: string;
  tags?: string[];
  fqdn: string;
  custom_domain?: string | null;
  subdomain: string;
  created_at: string;
  updated_at: string;
}

export interface Site {
  id: string;
  account_id: number;
  vector_cluster_id: string;
  partner_customer_id: string;
  status: SiteStatus;
  tags: string[];
  dev_domain: string;
  dev_db_username?: string;
  dev_db_password?: string;
  dev_sftp_password?: string;
  environments: Environment[];
  created_at: string;
  updated_at: string;
}

export interface CreateSiteRequest {
  partner_customer_id: string;
  dev_php_version: '7.2' | '7.3' | '7.4' | '8.0' | '8.1' | '8.2' | '8.3' | '8.4' | '8.5';
  tags?: string[];
}

export interface UpdateSiteRequest {
  partner_customer_id?: string;
  tags?: string[];
}

// Environment types
export type EnvironmentStatus = 'pending' | 'provisioning' | 'active' | 'suspended' | 'failed' | 'terminating' | 'terminated';

export interface CreateEnvironmentRequest {
  name: string;
  php_version: '7.2' | '7.3' | '7.4' | '8.0' | '8.1' | '8.2' | '8.3' | '8.4' | '8.5';
  is_production?: boolean;
  custom_domain?: string;
  tags?: string[];
}

export interface UpdateEnvironmentRequest {
  php_version?: '7.2' | '7.3' | '7.4' | '8.0' | '8.1' | '8.2' | '8.3' | '8.4' | '8.5';
  custom_domain?: string | null;
  tags?: string[];
}

// Deployment types
export type DeploymentStatus = 'pending' | 'deploying' | 'deployed' | 'failed';

export interface Deployment {
  id: string;
  vector_environment_id: string;
  status: DeploymentStatus;
  stdout?: string | null;
  stderr?: string | null;
  actor: string;
  environment?: Environment;
  created_at: string;
  updated_at: string;
}

export interface RollbackDeploymentRequest {
  target_deployment_id?: string;
}

// Secret types
export interface Secret {
  id: string;
  key: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSecretRequest {
  key: string;
  value: string;
}

export interface UpdateSecretRequest {
  key?: string;
  value?: string;
}

// API Key types
export interface ApiKey {
  id: number;
  name: string;
  token?: string;
  abilities?: string[];
  last_used_at?: string | null;
  expires_at?: string | null;
  created_at: string;
}

export interface CreateApiKeyRequest {
  name: string;
  abilities?: string[];
}

// SSH Key types
export interface SshKey {
  id: string;
  account_id: number;
  vector_site_id?: string | null;
  name: string;
  fingerprint: string;
  public_key_preview: string;
  is_account_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSshKeyRequest {
  name: string;
  public_key: string;
}

// Webhook types
export type WebhookType = 'http' | 'slack';

export interface Webhook {
  id: string;
  type: WebhookType;
  url: string;
  events: string[];
  secret?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateWebhookRequest {
  type: WebhookType;
  url: string;
  events: string[];
}

export interface UpdateWebhookRequest {
  url?: string;
  events?: string[];
  is_active?: boolean;
}

// WAF types
export interface AllowedReferrer {
  hostname: string;
}

export interface BlockedReferrer {
  hostname: string;
}

export interface BlockedIp {
  ip: string;
  note?: string;
}

export interface RateLimit {
  id: string;
  path_pattern: string;
  requests_per_minute: number;
  created_at: string;
  updated_at: string;
}

export interface CreateRateLimitRequest {
  path_pattern: string;
  requests_per_minute: number;
}

export interface UpdateRateLimitRequest {
  path_pattern?: string;
  requests_per_minute?: number;
}

// PHP Version types
export interface PhpVersion {
  value: string;
  label: string;
}

// Event types
export interface Event {
  id: string;
  type: string;
  actor?: string;
  data: Record<string, unknown>;
  created_at: string;
}

// Log types
export interface LogColumn {
  name: string;
  type: string;
}

export interface LogTable {
  name: string;
  columns: LogColumn[];
  rows: unknown[][];
}

export interface LogsResponse {
  tables: LogTable[];
  status: {
    rowsExamined: number;
    rowsMatched: number;
  };
}

export interface GetLogsParams {
  start_time?: string;
  end_time?: string;
  limit?: number;
  environment?: string;
  deployment_id?: string;
}

// Webhook Log types
export interface WebhookLog {
  id: string;
  webhook_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  response_status?: number;
  response_body?: string;
  created_at: string;
}

// SSL types
export interface SslStatus extends Environment {
  // Inherits all Environment fields including provisioning_step and failure_reason
}

export interface NudgeSslRequest {
  retry?: boolean;
}

// Cache Purge types
export interface PurgeCacheRequest {
  cache_tag?: string;
  url?: string;
}

export interface PurgeCacheResponse {
  cache_tag?: string;
  url?: string;
}

// Password Reset Response types
export interface PasswordResetResponse extends Site {
  dev_sftp_password?: string;
  dev_db_password?: string;
}

export interface EnvironmentPasswordResetResponse extends Environment {
  db_password?: string;
}
