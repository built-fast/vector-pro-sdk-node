import { VectorProError, type ApiErrorResponse } from './errors.js';
import type {
  VectorProClientOptions,
  PaginationParams,
  PaginatedResponse,
  Site,
  CreateSiteRequest,
  UpdateSiteRequest,
  Environment,
  CreateEnvironmentRequest,
  UpdateEnvironmentRequest,
  Deployment,
  RollbackDeploymentRequest,
  Secret,
  CreateSecretRequest,
  UpdateSecretRequest,
  ApiKey,
  CreateApiKeyRequest,
  SshKey,
  CreateSshKeyRequest,
  Webhook,
  CreateWebhookRequest,
  UpdateWebhookRequest,
  AllowedReferrer,
  BlockedReferrer,
  BlockedIp,
  RateLimit,
  CreateRateLimitRequest,
  UpdateRateLimitRequest,
  PhpVersion,
  Event,
  LogsResponse,
  GetLogsParams,
  WebhookLog,
  SslStatus,
  NudgeSslRequest,
  PurgeCacheRequest,
  PurgeCacheResponse,
  PasswordResetResponse,
  EnvironmentPasswordResetResponse,
} from './types.js';

const DEFAULT_BASE_URL = 'https://api.builtfast.com';

interface ApiResponse<T> {
  data: T;
  message: string;
  http_status: number;
  links?: Record<string, string | null>;
  meta?: Record<string, unknown>;
}

export class VectorProClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(options: VectorProClientOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    body?: object,
    query?: Record<string, string | number | undefined>
  ): Promise<T> {
    let url = `${this.baseUrl}${path}`;

    if (query) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      }
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const init: RequestInit = {
      method,
      headers,
    };

    if (body !== undefined) {
      init.body = JSON.stringify(body);
    }

    const response = await fetch(url, init);

    const json = (await response.json()) as ApiResponse<T> | ApiErrorResponse;

    if (!response.ok) {
      throw new VectorProError(response.status, json as ApiErrorResponse);
    }

    return (json as ApiResponse<T>).data;
  }

  private async requestPaginated<T>(
    path: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<T>> {
    let url = `${this.baseUrl}${path}`;

    if (params) {
      const searchParams = new URLSearchParams();
      if (params.page !== undefined) {
        searchParams.append('page', String(params.page));
      }
      if (params.per_page !== undefined) {
        searchParams.append('per_page', String(params.per_page));
      }
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const json = (await response.json()) as (ApiResponse<T[]> & { links: Record<string, string | null>; meta: Record<string, unknown> }) | ApiErrorResponse;

    if (!response.ok) {
      throw new VectorProError(response.status, json as ApiErrorResponse);
    }

    const typedJson = json as ApiResponse<T[]> & { links: Record<string, string | null>; meta: Record<string, unknown> };
    return {
      data: typedJson.data,
      links: typedJson.links ?? {},
      meta: typedJson.meta ?? {},
    };
  }

  // =============================================================================
  // Sites
  // =============================================================================

  /**
   * List all sites
   */
  async getSites(params?: PaginationParams): Promise<PaginatedResponse<Site>> {
    return this.requestPaginated<Site>('/api/v1/vector/sites', params);
  }

  /**
   * Get a specific site
   */
  async getSite(siteId: string): Promise<Site> {
    return this.request<Site>('GET', `/api/v1/vector/sites/${siteId}`);
  }

  /**
   * Create a new site
   */
  async createSite(data: CreateSiteRequest): Promise<Site> {
    return this.request<Site>('POST', '/api/v1/vector/sites', data);
  }

  /**
   * Update a site
   */
  async updateSite(siteId: string, data: UpdateSiteRequest): Promise<Site> {
    return this.request<Site>('PUT', `/api/v1/vector/sites/${siteId}`, data);
  }

  /**
   * Delete a site
   */
  async deleteSite(siteId: string): Promise<Site> {
    return this.request<Site>('DELETE', `/api/v1/vector/sites/${siteId}`);
  }

  /**
   * Suspend a site
   */
  async suspendSite(siteId: string): Promise<Site> {
    return this.request<Site>('POST', `/api/v1/vector/sites/${siteId}/suspend`);
  }

  /**
   * Unsuspend a site
   */
  async unsuspendSite(siteId: string): Promise<Site> {
    return this.request<Site>('POST', `/api/v1/vector/sites/${siteId}/unsuspend`);
  }

  /**
   * Reset site SFTP password
   */
  async resetSiteSftpPassword(siteId: string): Promise<PasswordResetResponse> {
    return this.request<PasswordResetResponse>('POST', `/api/v1/vector/sites/${siteId}/reset-sftp-password`);
  }

  /**
   * Reset site database password
   */
  async resetSiteDatabasePassword(siteId: string): Promise<PasswordResetResponse> {
    return this.request<PasswordResetResponse>('POST', `/api/v1/vector/sites/${siteId}/reset-database-password`);
  }

  /**
   * Purge site cache
   */
  async purgeSiteCache(siteId: string, data?: PurgeCacheRequest): Promise<PurgeCacheResponse> {
    return this.request<PurgeCacheResponse>('POST', `/api/v1/vector/sites/${siteId}/purge-cache`, data ?? {});
  }

  // =============================================================================
  // Environments
  // =============================================================================

  /**
   * List environments for a site
   */
  async getEnvironments(siteId: string, params?: PaginationParams): Promise<PaginatedResponse<Environment>> {
    return this.requestPaginated<Environment>(`/api/v1/vector/sites/${siteId}/environments`, params);
  }

  /**
   * Get a specific environment
   */
  async getEnvironment(siteId: string, environmentName: string): Promise<Environment> {
    return this.request<Environment>('GET', `/api/v1/vector/sites/${siteId}/environments/${environmentName}`);
  }

  /**
   * Create a new environment
   */
  async createEnvironment(siteId: string, data: CreateEnvironmentRequest): Promise<Environment> {
    return this.request<Environment>('POST', `/api/v1/vector/sites/${siteId}/environments`, data);
  }

  /**
   * Update an environment
   */
  async updateEnvironment(siteId: string, environmentName: string, data: UpdateEnvironmentRequest): Promise<Environment> {
    return this.request<Environment>('PUT', `/api/v1/vector/sites/${siteId}/environments/${environmentName}`, data);
  }

  /**
   * Delete an environment
   */
  async deleteEnvironment(siteId: string, environmentName: string): Promise<Environment> {
    return this.request<Environment>('DELETE', `/api/v1/vector/sites/${siteId}/environments/${environmentName}`);
  }

  /**
   * Suspend an environment
   */
  async suspendEnvironment(siteId: string, environmentName: string): Promise<Environment> {
    return this.request<Environment>('POST', `/api/v1/vector/sites/${siteId}/environments/${environmentName}/suspend`);
  }

  /**
   * Unsuspend an environment
   */
  async unsuspendEnvironment(siteId: string, environmentName: string): Promise<Environment> {
    return this.request<Environment>('POST', `/api/v1/vector/sites/${siteId}/environments/${environmentName}/unsuspend`);
  }

  /**
   * Reset environment database password
   */
  async resetEnvironmentDatabasePassword(siteId: string, environmentName: string): Promise<EnvironmentPasswordResetResponse> {
    return this.request<EnvironmentPasswordResetResponse>('POST', `/api/v1/vector/sites/${siteId}/environments/${environmentName}/reset-database-password`);
  }

  // =============================================================================
  // Deployments
  // =============================================================================

  /**
   * List deployments for an environment
   */
  async getDeployments(siteId: string, environmentName: string, params?: PaginationParams): Promise<PaginatedResponse<Deployment>> {
    return this.requestPaginated<Deployment>(`/api/v1/vector/sites/${siteId}/environments/${environmentName}/deployments`, params);
  }

  /**
   * Get a specific deployment
   */
  async getDeployment(siteId: string, environmentName: string, deploymentId: string): Promise<Deployment> {
    return this.request<Deployment>('GET', `/api/v1/vector/sites/${siteId}/environments/${environmentName}/deployments/${deploymentId}`);
  }

  /**
   * Create a new deployment
   */
  async createDeployment(siteId: string, environmentName: string): Promise<Deployment> {
    return this.request<Deployment>('POST', `/api/v1/vector/sites/${siteId}/environments/${environmentName}/deployments`);
  }

  /**
   * Rollback to a previous deployment
   */
  async rollbackDeployment(siteId: string, environmentName: string, data?: RollbackDeploymentRequest): Promise<Deployment> {
    return this.request<Deployment>('POST', `/api/v1/vector/sites/${siteId}/environments/${environmentName}/rollback`, data ?? {});
  }

  // =============================================================================
  // SSL
  // =============================================================================

  /**
   * Get SSL status for an environment
   */
  async getSslStatus(siteId: string, environmentName: string): Promise<SslStatus> {
    return this.request<SslStatus>('GET', `/api/v1/vector/sites/${siteId}/environments/${environmentName}/ssl`);
  }

  /**
   * Nudge SSL provisioning
   */
  async nudgeSsl(siteId: string, environmentName: string, data?: NudgeSslRequest): Promise<SslStatus> {
    return this.request<SslStatus>('POST', `/api/v1/vector/sites/${siteId}/environments/${environmentName}/ssl/nudge`, data ?? {});
  }

  // =============================================================================
  // Environment Secrets
  // =============================================================================

  /**
   * List secrets for an environment
   */
  async getEnvironmentSecrets(siteId: string, environmentName: string, params?: PaginationParams): Promise<PaginatedResponse<Secret>> {
    return this.requestPaginated<Secret>(`/api/v1/vector/sites/${siteId}/environments/${environmentName}/secrets`, params);
  }

  /**
   * Create an environment secret
   */
  async createEnvironmentSecret(siteId: string, environmentName: string, data: CreateSecretRequest): Promise<Secret> {
    return this.request<Secret>('POST', `/api/v1/vector/sites/${siteId}/environments/${environmentName}/secrets`, data);
  }

  /**
   * Update an environment secret
   */
  async updateEnvironmentSecret(siteId: string, environmentName: string, secretId: string, data: UpdateSecretRequest): Promise<Secret> {
    return this.request<Secret>('PUT', `/api/v1/vector/sites/${siteId}/environments/${environmentName}/secrets/${secretId}`, data);
  }

  /**
   * Delete an environment secret
   */
  async deleteEnvironmentSecret(siteId: string, environmentName: string, secretId: string): Promise<Secret> {
    return this.request<Secret>('DELETE', `/api/v1/vector/sites/${siteId}/environments/${environmentName}/secrets/${secretId}`);
  }

  // =============================================================================
  // Global Secrets
  // =============================================================================

  /**
   * List global secrets
   */
  async getGlobalSecrets(params?: PaginationParams): Promise<PaginatedResponse<Secret>> {
    return this.requestPaginated<Secret>('/api/v1/vector/global-secrets', params);
  }

  /**
   * Create a global secret
   */
  async createGlobalSecret(data: CreateSecretRequest): Promise<Secret> {
    return this.request<Secret>('POST', '/api/v1/vector/global-secrets', data);
  }

  /**
   * Update a global secret
   */
  async updateGlobalSecret(secretId: string, data: UpdateSecretRequest): Promise<Secret> {
    return this.request<Secret>('PUT', `/api/v1/vector/global-secrets/${secretId}`, data);
  }

  /**
   * Delete a global secret
   */
  async deleteGlobalSecret(secretId: string): Promise<Secret> {
    return this.request<Secret>('DELETE', `/api/v1/vector/global-secrets/${secretId}`);
  }

  // =============================================================================
  // API Keys
  // =============================================================================

  /**
   * List API keys
   */
  async getApiKeys(params?: PaginationParams): Promise<PaginatedResponse<ApiKey>> {
    return this.requestPaginated<ApiKey>('/api/v1/vector/api-keys', params);
  }

  /**
   * Create an API key
   */
  async createApiKey(data: CreateApiKeyRequest): Promise<ApiKey> {
    return this.request<ApiKey>('POST', '/api/v1/vector/api-keys', data);
  }

  /**
   * Delete an API key
   */
  async deleteApiKey(tokenId: number): Promise<ApiKey> {
    return this.request<ApiKey>('DELETE', `/api/v1/vector/api-keys/${tokenId}`);
  }

  // =============================================================================
  // SSH Keys - Account
  // =============================================================================

  /**
   * List account SSH keys
   */
  async getSshKeys(params?: PaginationParams): Promise<PaginatedResponse<SshKey>> {
    return this.requestPaginated<SshKey>('/api/v1/vector/ssh-keys', params);
  }

  /**
   * Get a specific account SSH key
   */
  async getSshKey(sshKeyId: string): Promise<SshKey> {
    return this.request<SshKey>('GET', `/api/v1/vector/ssh-keys/${sshKeyId}`);
  }

  /**
   * Create an account SSH key
   */
  async createSshKey(data: CreateSshKeyRequest): Promise<SshKey> {
    return this.request<SshKey>('POST', '/api/v1/vector/ssh-keys', data);
  }

  /**
   * Delete an account SSH key
   */
  async deleteSshKey(sshKeyId: string): Promise<SshKey> {
    return this.request<SshKey>('DELETE', `/api/v1/vector/ssh-keys/${sshKeyId}`);
  }

  // =============================================================================
  // SSH Keys - Site
  // =============================================================================

  /**
   * List SSH keys for a site
   */
  async getSiteSshKeys(siteId: string, params?: PaginationParams): Promise<PaginatedResponse<SshKey>> {
    return this.requestPaginated<SshKey>(`/api/v1/vector/sites/${siteId}/ssh-keys`, params);
  }

  /**
   * Add an SSH key to a site
   */
  async addSiteSshKey(siteId: string, data: CreateSshKeyRequest): Promise<SshKey> {
    return this.request<SshKey>('POST', `/api/v1/vector/sites/${siteId}/ssh-keys`, data);
  }

  /**
   * Remove an SSH key from a site
   */
  async removeSiteSshKey(siteId: string, sshKeyId: string): Promise<SshKey> {
    return this.request<SshKey>('DELETE', `/api/v1/vector/sites/${siteId}/ssh-keys/${sshKeyId}`);
  }

  // =============================================================================
  // Webhooks
  // =============================================================================

  /**
   * List webhooks
   */
  async getWebhooks(params?: PaginationParams): Promise<PaginatedResponse<Webhook>> {
    return this.requestPaginated<Webhook>('/api/v1/vector/webhooks', params);
  }

  /**
   * Get a specific webhook
   */
  async getWebhook(webhookId: string): Promise<Webhook> {
    return this.request<Webhook>('GET', `/api/v1/vector/webhooks/${webhookId}`);
  }

  /**
   * Create a webhook
   */
  async createWebhook(data: CreateWebhookRequest): Promise<Webhook> {
    return this.request<Webhook>('POST', '/api/v1/vector/webhooks', data);
  }

  /**
   * Update a webhook
   */
  async updateWebhook(webhookId: string, data: UpdateWebhookRequest): Promise<Webhook> {
    return this.request<Webhook>('PUT', `/api/v1/vector/webhooks/${webhookId}`, data);
  }

  /**
   * Delete a webhook
   */
  async deleteWebhook(webhookId: string): Promise<Webhook> {
    return this.request<Webhook>('DELETE', `/api/v1/vector/webhooks/${webhookId}`);
  }

  /**
   * Rotate webhook secret
   */
  async rotateWebhookSecret(webhookId: string): Promise<Webhook> {
    return this.request<Webhook>('POST', `/api/v1/vector/webhooks/${webhookId}/rotate-secret`);
  }

  // =============================================================================
  // WAF - Allowed Referrers
  // =============================================================================

  /**
   * List allowed referrers for a site
   */
  async getAllowedReferrers(siteId: string): Promise<AllowedReferrer[]> {
    return this.request<AllowedReferrer[]>('GET', `/api/v1/vector/sites/${siteId}/waf/allowed-referrers`);
  }

  /**
   * Add an allowed referrer
   */
  async addAllowedReferrer(siteId: string, hostname: string): Promise<AllowedReferrer> {
    return this.request<AllowedReferrer>('POST', `/api/v1/vector/sites/${siteId}/waf/allowed-referrers`, { hostname });
  }

  /**
   * Remove an allowed referrer
   */
  async removeAllowedReferrer(siteId: string, hostname: string): Promise<AllowedReferrer> {
    return this.request<AllowedReferrer>('DELETE', `/api/v1/vector/sites/${siteId}/waf/allowed-referrers/${encodeURIComponent(hostname)}`);
  }

  // =============================================================================
  // WAF - Blocked Referrers
  // =============================================================================

  /**
   * List blocked referrers for a site
   */
  async getBlockedReferrers(siteId: string): Promise<BlockedReferrer[]> {
    return this.request<BlockedReferrer[]>('GET', `/api/v1/vector/sites/${siteId}/waf/blocked-referrers`);
  }

  /**
   * Add a blocked referrer
   */
  async addBlockedReferrer(siteId: string, hostname: string): Promise<BlockedReferrer> {
    return this.request<BlockedReferrer>('POST', `/api/v1/vector/sites/${siteId}/waf/blocked-referrers`, { hostname });
  }

  /**
   * Remove a blocked referrer
   */
  async removeBlockedReferrer(siteId: string, hostname: string): Promise<BlockedReferrer> {
    return this.request<BlockedReferrer>('DELETE', `/api/v1/vector/sites/${siteId}/waf/blocked-referrers/${encodeURIComponent(hostname)}`);
  }

  // =============================================================================
  // WAF - Blocked IPs
  // =============================================================================

  /**
   * List blocked IPs for a site
   */
  async getBlockedIps(siteId: string): Promise<BlockedIp[]> {
    return this.request<BlockedIp[]>('GET', `/api/v1/vector/sites/${siteId}/waf/blocked-ips`);
  }

  /**
   * Add a blocked IP
   */
  async addBlockedIp(siteId: string, ip: string, note?: string): Promise<BlockedIp> {
    return this.request<BlockedIp>('POST', `/api/v1/vector/sites/${siteId}/waf/blocked-ips`, { ip, note });
  }

  /**
   * Remove a blocked IP
   */
  async removeBlockedIp(siteId: string, ip: string): Promise<BlockedIp> {
    return this.request<BlockedIp>('DELETE', `/api/v1/vector/sites/${siteId}/waf/blocked-ips/${encodeURIComponent(ip)}`);
  }

  // =============================================================================
  // WAF - Rate Limits
  // =============================================================================

  /**
   * List rate limits for a site
   */
  async getRateLimits(siteId: string): Promise<RateLimit[]> {
    return this.request<RateLimit[]>('GET', `/api/v1/vector/sites/${siteId}/waf/rate-limits`);
  }

  /**
   * Create a rate limit
   */
  async createRateLimit(siteId: string, data: CreateRateLimitRequest): Promise<RateLimit> {
    return this.request<RateLimit>('POST', `/api/v1/vector/sites/${siteId}/waf/rate-limits`, data);
  }

  /**
   * Update a rate limit
   */
  async updateRateLimit(siteId: string, rateLimitId: string, data: UpdateRateLimitRequest): Promise<RateLimit> {
    return this.request<RateLimit>('PUT', `/api/v1/vector/sites/${siteId}/waf/rate-limits/${rateLimitId}`, data);
  }

  /**
   * Delete a rate limit
   */
  async deleteRateLimit(siteId: string, rateLimitId: string): Promise<RateLimit> {
    return this.request<RateLimit>('DELETE', `/api/v1/vector/sites/${siteId}/waf/rate-limits/${rateLimitId}`);
  }

  // =============================================================================
  // Read-Only Operations
  // =============================================================================

  /**
   * List available PHP versions
   */
  async getPhpVersions(): Promise<PhpVersion[]> {
    return this.request<PhpVersion[]>('GET', '/api/v1/vector/php-versions');
  }

  /**
   * List events
   */
  async getEvents(params?: PaginationParams): Promise<PaginatedResponse<Event>> {
    return this.requestPaginated<Event>('/api/v1/vector/events', params);
  }

  /**
   * Get site logs
   */
  async getSiteLogs(siteId: string, params?: GetLogsParams): Promise<LogsResponse> {
    return this.request<LogsResponse>('GET', `/api/v1/vector/sites/${siteId}/logs`, undefined, params as Record<string, string | number | undefined>);
  }

  /**
   * Get webhook logs
   */
  async getWebhookLogs(webhookId: string, params?: PaginationParams): Promise<PaginatedResponse<WebhookLog>> {
    return this.requestPaginated<WebhookLog>(`/api/v1/vector/webhooks/${webhookId}/logs`, params);
  }
}
