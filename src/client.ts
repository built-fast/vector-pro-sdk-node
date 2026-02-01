export interface VectorProClientConfig {
  apiKey: string;
  baseUrl?: string;
}

export class VectorProApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
    message?: string,
  ) {
    super(message || `API error: ${status}`);
    this.name = 'VectorProApiError';
  }
}

export interface PaginationOptions {
  perPage?: number;
  page?: number;
}

// Pagination metadata
export interface PaginationLinks {
  first?: string;
  last?: string;
  prev?: string | null;
  next?: string | null;
}

export interface PaginationMeta {
  current_page?: number;
  from?: number;
  last_page?: number;
  path?: string;
  per_page?: number;
  to?: number;
  total?: number;
}

// Base API response wrapper
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  http_status?: number;
}

export interface ListResponse<T> {
  data?: T[];
  links?: PaginationLinks;
  meta?: PaginationMeta;
  message?: string;
  http_status?: number;
}

// Entity types
export interface EnvironmentSummary {
  id?: string;
  name?: string;
  is_production?: boolean;
  status?: string;
  php_version?: string;
  platform_domain?: string;
  custom_domain?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Site {
  id?: string;
  account_id?: number;
  partner_customer_id?: string;
  status?: string;
  tags?: string[];
  dev_domain?: string;
  environments?: EnvironmentSummary[];
  created_at?: string;
  updated_at?: string;
}

export interface SiteWithCredentials extends Site {
  dev_php_version?: string;
  dev_sftp?: {
    hostname?: string;
    port?: number;
    username?: string;
    password?: string;
  };
  dev_db_username?: string;
  dev_db_password?: string;
}

export interface Environment {
  id?: string;
  vector_site_id?: string;
  partner_customer_id?: string;
  name?: string;
  is_production?: boolean;
  status?: string;
  provisioning_step?: string;
  failure_reason?: string;
  php_version?: string;
  tags?: string[];
  fqdn?: string;
  custom_domain?: string;
  subdomain?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EnvironmentWithCredentials extends Environment {
  database_user?: string;
  database_password?: string;
}

export interface Deployment {
  id?: string;
  vector_environment_id?: string;
  status?: string;
  stdout?: string;
  stderr?: string;
  actor?: string;
  environment?: {
    id?: string;
    vector_site_id?: string;
    partner_customer_id?: string;
    name?: string;
    is_production?: boolean;
    status?: string;
    php_version?: string;
    tags?: string[];
    fqdn?: string;
    custom_domain?: string;
    subdomain?: string;
    created_at?: string;
    updated_at?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface Secret {
  id?: string;
  key?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SshKey {
  id?: string;
  account_id?: number;
  vector_site_id?: string;
  name?: string;
  fingerprint?: string;
  public_key_preview?: string;
  is_account_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ApiKey {
  id?: number;
  name?: string;
  token?: string;
  abilities?: string[];
  last_used_at?: string;
  expires_at?: string;
  created_at?: string;
}

export interface Webhook {
  id?: string;
  account_id?: number;
  type?: string;
  url?: string;
  events?: string[];
  secret?: string;
  enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface WebhookLog {
  id?: string;
  vector_webhook_delivery_id?: string;
  vector_webhook_id?: string;
  event?: string;
  request_body?: {
    event?: string;
    data?: unknown;
  };
  attempt?: number;
  response_status?: number;
  response_body?: string;
  response_headers?: Record<string, string>;
  latency_ms?: number;
  created_at?: string;
}

export interface Event {
  id?: string;
  event?: string;
  model_type?: string;
  model_id?: string;
  context?: string;
  occurred_at?: string;
  created_at?: string;
  actor?: {
    ip?: string;
    token_name?: string;
  };
}

export interface PhpVersion {
  value?: string;
  label?: string;
}

export interface AccountSummary {
  owner?: {
    name?: string;
    email?: string;
  };
  account?: {
    name?: string;
    company?: string;
  };
  cluster?: {
    alb_dns_name?: string;
    aurora_cluster_endpoint?: string;
    ssh_nlb_dns?: string;
  };
  domains?: string[];
  sites?: {
    total?: number;
    by_status?: {
      pending?: number;
      activation_requested?: number;
      active?: number;
      suspension_requested?: number;
      suspended?: number;
      unsuspension_requested?: number;
      termination_requested?: number;
      terminated?: number;
      canceled?: number;
    };
  };
  environments?: {
    total?: number;
    by_status?: {
      pending?: number;
      provisioning?: number;
      active?: number;
      suspending?: number;
      suspended?: number;
      unsuspending?: number;
      terminating?: number;
      terminated?: number;
      failed?: number;
    };
  };
}

export interface ReferrerEntry {
  hostname?: string;
}

export interface BlockedIpEntry {
  ip?: string;
}

export interface RateLimit {
  id?: number;
  name?: string;
  description?: string;
  shield_zone_id?: number;
  configuration?: {
    request_count?: number;
    timeframe?: number;
    block_time?: number;
    value?: string;
    action?: string;
    operator?: string;
    variables?: string[];
    transformations?: string[];
  };
}

export interface LogsResponse {
  tables?: Array<{
    name?: string;
    columns?: Array<{
      name?: string;
      type?: string;
    }>;
    rows?: unknown[][];
  }>;
  status?: {
    rowsExamined?: number;
    rowsMatched?: number;
  };
}

export interface DbImportSession {
  id?: string;
  vector_site_id?: string;
  status?: string;
  filename?: string;
  content_length?: number;
  checksum?: {
    provided_md5?: string;
    s3_etag?: string;
  };
  options?: {
    drop_tables?: boolean;
    disable_foreign_keys?: boolean;
  };
  upload_url?: string;
  upload_expires_at?: string;
  duration_ms?: number | string;
  error_message?: string;
  created_at?: string;
  uploaded_at?: string;
  started_at?: string;
  completed_at?: string;
}

export interface DbExport {
  id?: string;
  vector_site_id?: string;
  status?: string;
  format?: string;
  size_bytes?: number | string;
  duration_ms?: number | string;
  error_message?: string;
  download_url?: string;
  download_expires_at?: string;
  created_at?: string;
  started_at?: string;
  completed_at?: string;
}

type RequestOptions = {
  method?: string;
  path: string;
  query?: Record<string, unknown>;
  body?: unknown;
};

export class VectorProClient {
  private baseUrl: string;
  private apiKey: string;

  readonly sites: SitesApi;
  readonly environments: EnvironmentsApi;
  readonly account: AccountApi;
  readonly webhooks: WebhooksApi;
  readonly events: EventsApi;
  readonly phpVersions: PhpVersionsApi;

  constructor(config: VectorProClientConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.builtfast.com';

    this.sites = new SitesApi(this);
    this.environments = new EnvironmentsApi(this);
    this.account = new AccountApi(this);
    this.webhooks = new WebhooksApi(this);
    this.events = new EventsApi(this);
    this.phpVersions = new PhpVersionsApi(this);
  }

  async request<T = unknown>(options: RequestOptions): Promise<T> {
    const url = new URL(options.path, this.baseUrl);

    if (options.query) {
      for (const [key, value] of Object.entries(options.query)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const response = await fetch(url.toString(), {
      method: options.method || 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new VectorProApiError(response.status, data);
    }

    return data as T;
  }
}

class SitesApi {
  constructor(private client: VectorProClient) {}

  list(options?: PaginationOptions): Promise<ListResponse<Site>> {
    return this.client.request<ListResponse<Site>>({
      path: '/api/v1/vector/sites',
      query: { per_page: options?.perPage, page: options?.page },
    });
  }

  get(siteId: string): Promise<ApiResponse<Site>> {
    return this.client.request<ApiResponse<Site>>({ path: `/api/v1/vector/sites/${siteId}` });
  }

  create(data: { partner_customer_id: string; dev_php_version: string; tags?: string[] }): Promise<ApiResponse<SiteWithCredentials>> {
    return this.client.request<ApiResponse<SiteWithCredentials>>({
      method: 'POST',
      path: '/api/v1/vector/sites',
      body: data,
    });
  }

  update(siteId: string, data: { partner_customer_id?: string; tags?: string[] }): Promise<ApiResponse<Site>> {
    return this.client.request<ApiResponse<Site>>({
      method: 'PUT',
      path: `/api/v1/vector/sites/${siteId}`,
      body: data,
    });
  }

  delete(siteId: string): Promise<ApiResponse<Site>> {
    return this.client.request<ApiResponse<Site>>({
      method: 'DELETE',
      path: `/api/v1/vector/sites/${siteId}`,
    });
  }

  clone(siteId: string, data?: { partner_customer_id?: string; dev_php_version?: string; tags?: string[] }): Promise<ApiResponse<SiteWithCredentials>> {
    return this.client.request<ApiResponse<SiteWithCredentials>>({
      method: 'POST',
      path: `/api/v1/vector/sites/${siteId}/clone`,
      body: data,
    });
  }

  suspend(siteId: string): Promise<ApiResponse<Site>> {
    return this.client.request<ApiResponse<Site>>({
      method: 'PUT',
      path: `/api/v1/vector/sites/${siteId}/suspend`,
    });
  }

  unsuspend(siteId: string): Promise<ApiResponse<Site>> {
    return this.client.request<ApiResponse<Site>>({
      method: 'PUT',
      path: `/api/v1/vector/sites/${siteId}/unsuspend`,
    });
  }

  resetSftpPassword(siteId: string): Promise<ApiResponse<SiteWithCredentials>> {
    return this.client.request<ApiResponse<SiteWithCredentials>>({
      method: 'POST',
      path: `/api/v1/vector/sites/${siteId}/sftp/reset-password`,
    });
  }

  resetDatabasePassword(siteId: string): Promise<ApiResponse<SiteWithCredentials>> {
    return this.client.request<ApiResponse<SiteWithCredentials>>({
      method: 'POST',
      path: `/api/v1/vector/sites/${siteId}/database/reset-password`,
    });
  }

  getLogs(siteId: string, options?: {
    startTime?: string;
    endTime?: string;
    limit?: number;
    environment?: string;
    deploymentId?: string;
  }): Promise<ApiResponse<LogsResponse>> {
    return this.client.request<ApiResponse<LogsResponse>>({
      path: `/api/v1/vector/sites/${siteId}/logs`,
      query: {
        start_time: options?.startTime,
        end_time: options?.endTime,
        limit: options?.limit,
        environment: options?.environment,
        deployment_id: options?.deploymentId,
      },
    });
  }

  purgeCache(siteId: string, options?: { cache_tag?: string; url?: string }): Promise<ApiResponse<{ cache_tag?: string; url?: string }>> {
    return this.client.request<ApiResponse<{ cache_tag?: string; url?: string }>>({
      method: 'POST',
      path: `/api/v1/vector/sites/${siteId}/purge-cache`,
      body: options,
    });
  }

  db = {
    importDirect: (siteId: string, options?: { dropTables?: boolean; disableForeignKeys?: boolean }): Promise<ApiResponse<{ success?: boolean; duration_ms?: number }>> =>
      this.client.request<ApiResponse<{ success?: boolean; duration_ms?: number }>>({
        method: 'POST',
        path: `/api/v1/vector/sites/${siteId}/db/import`,
        query: { drop_tables: options?.dropTables, disable_foreign_keys: options?.disableForeignKeys },
      }),

    createImportSession: (siteId: string, data?: {
      filename?: string;
      content_length?: number;
      content_md5?: string;
      options?: { drop_tables?: boolean; disable_foreign_keys?: boolean };
    }): Promise<ApiResponse<DbImportSession>> =>
      this.client.request<ApiResponse<DbImportSession>>({
        method: 'POST',
        path: `/api/v1/vector/sites/${siteId}/db/imports`,
        body: data,
      }),

    runImport: (siteId: string, importId: string): Promise<ApiResponse<DbImportSession>> =>
      this.client.request<ApiResponse<DbImportSession>>({
        method: 'POST',
        path: `/api/v1/vector/sites/${siteId}/db/imports/${importId}/run`,
      }),

    getImportStatus: (siteId: string, importId: string): Promise<ApiResponse<DbImportSession>> =>
      this.client.request<ApiResponse<DbImportSession>>({
        path: `/api/v1/vector/sites/${siteId}/db/imports/${importId}`,
      }),

    createExport: (siteId: string, options?: { format?: string }): Promise<ApiResponse<DbExport>> =>
      this.client.request<ApiResponse<DbExport>>({
        method: 'POST',
        path: `/api/v1/vector/sites/${siteId}/db/export`,
        body: options,
      }),

    getExportStatus: (siteId: string, exportId: string): Promise<ApiResponse<DbExport>> =>
      this.client.request<ApiResponse<DbExport>>({
        path: `/api/v1/vector/sites/${siteId}/db/exports/${exportId}`,
      }),
  };

  waf = {
    listAllowedReferrers: (siteId: string): Promise<ApiResponse<ReferrerEntry[]>> =>
      this.client.request<ApiResponse<ReferrerEntry[]>>({ path: `/api/v1/vector/sites/${siteId}/waf/allowed-referrers` }),

    addAllowedReferrer: (siteId: string, hostname: string): Promise<ApiResponse<ReferrerEntry>> =>
      this.client.request<ApiResponse<ReferrerEntry>>({
        method: 'POST',
        path: `/api/v1/vector/sites/${siteId}/waf/allowed-referrers`,
        body: { hostname },
      }),

    removeAllowedReferrer: (siteId: string, hostname: string): Promise<ApiResponse<ReferrerEntry>> =>
      this.client.request<ApiResponse<ReferrerEntry>>({
        method: 'DELETE',
        path: `/api/v1/vector/sites/${siteId}/waf/allowed-referrers/${hostname}`,
      }),

    listBlockedReferrers: (siteId: string): Promise<ApiResponse<ReferrerEntry[]>> =>
      this.client.request<ApiResponse<ReferrerEntry[]>>({ path: `/api/v1/vector/sites/${siteId}/waf/blocked-referrers` }),

    addBlockedReferrer: (siteId: string, hostname: string): Promise<ApiResponse<ReferrerEntry>> =>
      this.client.request<ApiResponse<ReferrerEntry>>({
        method: 'POST',
        path: `/api/v1/vector/sites/${siteId}/waf/blocked-referrers`,
        body: { hostname },
      }),

    removeBlockedReferrer: (siteId: string, hostname: string): Promise<ApiResponse<ReferrerEntry>> =>
      this.client.request<ApiResponse<ReferrerEntry>>({
        method: 'DELETE',
        path: `/api/v1/vector/sites/${siteId}/waf/blocked-referrers/${hostname}`,
      }),

    listBlockedIPs: (siteId: string): Promise<ApiResponse<BlockedIpEntry[]>> =>
      this.client.request<ApiResponse<BlockedIpEntry[]>>({ path: `/api/v1/vector/sites/${siteId}/waf/blocked-ips` }),

    addBlockedIP: (siteId: string, ip: string): Promise<ApiResponse<BlockedIpEntry>> =>
      this.client.request<ApiResponse<BlockedIpEntry>>({
        method: 'POST',
        path: `/api/v1/vector/sites/${siteId}/waf/blocked-ips`,
        body: { ip },
      }),

    removeBlockedIP: (siteId: string, ip: string): Promise<ApiResponse<BlockedIpEntry>> =>
      this.client.request<ApiResponse<BlockedIpEntry>>({
        method: 'DELETE',
        path: `/api/v1/vector/sites/${siteId}/waf/blocked-ips/${ip}`,
      }),

    listRateLimits: (siteId: string): Promise<ApiResponse<RateLimit[]>> =>
      this.client.request<ApiResponse<RateLimit[]>>({ path: `/api/v1/vector/sites/${siteId}/waf/rate-limits` }),

    createRateLimit: (siteId: string, data: {
      name: string;
      description?: string;
      request_count: number;
      timeframe: number;
      block_time: number;
      value?: string;
      operator?: string;
      transformations?: string[];
      variables?: string[];
    }): Promise<ApiResponse<RateLimit>> =>
      this.client.request<ApiResponse<RateLimit>>({
        method: 'POST',
        path: `/api/v1/vector/sites/${siteId}/waf/rate-limits`,
        body: data,
      }),

    getRateLimit: (siteId: string, ruleId: number): Promise<ApiResponse<RateLimit>> =>
      this.client.request<ApiResponse<RateLimit>>({ path: `/api/v1/vector/sites/${siteId}/waf/rate-limits/${ruleId}` }),

    updateRateLimit: (siteId: string, ruleId: number, data: {
      name?: string;
      description?: string;
      request_count?: number;
      timeframe?: number;
      block_time?: number;
      value?: string;
      operator?: string;
      transformations?: string[];
      variables?: string[];
    }): Promise<ApiResponse<RateLimit>> =>
      this.client.request<ApiResponse<RateLimit>>({
        method: 'PUT',
        path: `/api/v1/vector/sites/${siteId}/waf/rate-limits/${ruleId}`,
        body: data,
      }),

    deleteRateLimit: (siteId: string, ruleId: number): Promise<ApiResponse<void>> =>
      this.client.request<ApiResponse<void>>({
        method: 'DELETE',
        path: `/api/v1/vector/sites/${siteId}/waf/rate-limits/${ruleId}`,
      }),
  };

  sshKeys = {
    list: (siteId: string, options?: PaginationOptions): Promise<ListResponse<SshKey>> =>
      this.client.request<ListResponse<SshKey>>({
        path: `/api/v1/vector/sites/${siteId}/ssh-keys`,
        query: { per_page: options?.perPage, page: options?.page },
      }),

    add: (siteId: string, data: { name: string; public_key: string }): Promise<ApiResponse<SshKey>> =>
      this.client.request<ApiResponse<SshKey>>({
        method: 'POST',
        path: `/api/v1/vector/sites/${siteId}/ssh-keys`,
        body: data,
      }),

    remove: (siteId: string, keyId: string): Promise<ApiResponse<SshKey>> =>
      this.client.request<ApiResponse<SshKey>>({
        method: 'DELETE',
        path: `/api/v1/vector/sites/${siteId}/ssh-keys/${keyId}`,
      }),
  };

  ssl = {
    getStatus: (siteId: string, envId: string): Promise<ApiResponse<Environment>> =>
      this.client.request<ApiResponse<Environment>>({ path: `/api/v1/vector/sites/${siteId}/environments/${envId}/ssl` }),

    nudge: (siteId: string, envId: string, options?: { retry?: boolean }): Promise<ApiResponse<Environment>> =>
      this.client.request<ApiResponse<Environment>>({
        method: 'POST',
        path: `/api/v1/vector/sites/${siteId}/environments/${envId}/ssl/nudge`,
        body: options,
      }),
  };
}

class EnvironmentsApi {
  constructor(private client: VectorProClient) {}

  list(siteId: string, options?: PaginationOptions): Promise<ListResponse<Environment>> {
    return this.client.request<ListResponse<Environment>>({
      path: `/api/v1/vector/sites/${siteId}/environments`,
      query: { per_page: options?.perPage, page: options?.page },
    });
  }

  get(siteId: string, envId: string): Promise<ApiResponse<Environment>> {
    return this.client.request<ApiResponse<Environment>>({ path: `/api/v1/vector/sites/${siteId}/environments/${envId}` });
  }

  create(siteId: string, data: {
    name: string;
    custom_domain: string | null;
    is_production?: boolean;
    php_version: string;
    tags?: string[];
  }): Promise<ApiResponse<Environment>> {
    return this.client.request<ApiResponse<Environment>>({
      method: 'POST',
      path: `/api/v1/vector/sites/${siteId}/environments`,
      body: data,
    });
  }

  update(siteId: string, envId: string, data: { name?: string; custom_domain?: string | null; tags?: string[] }): Promise<ApiResponse<Environment>> {
    return this.client.request<ApiResponse<Environment>>({
      method: 'PUT',
      path: `/api/v1/vector/sites/${siteId}/environments/${envId}`,
      body: data,
    });
  }

  delete(siteId: string, envId: string): Promise<ApiResponse<Environment>> {
    return this.client.request<ApiResponse<Environment>>({
      method: 'DELETE',
      path: `/api/v1/vector/sites/${siteId}/environments/${envId}`,
    });
  }

  deploy(siteId: string, envId: string): Promise<ApiResponse<Deployment>> {
    return this.client.request<ApiResponse<Deployment>>({
      method: 'POST',
      path: `/api/v1/vector/sites/${siteId}/environments/${envId}/deployments`,
    });
  }

  rollback(siteId: string, envId: string, targetDeploymentId?: string): Promise<ApiResponse<Deployment>> {
    return this.client.request<ApiResponse<Deployment>>({
      method: 'POST',
      path: `/api/v1/vector/sites/${siteId}/environments/${envId}/rollback`,
      body: targetDeploymentId ? { target_deployment_id: targetDeploymentId } : undefined,
    });
  }

  resetDatabasePassword(siteId: string, envId: string): Promise<ApiResponse<EnvironmentWithCredentials>> {
    return this.client.request<ApiResponse<EnvironmentWithCredentials>>({
      method: 'POST',
      path: `/api/v1/vector/sites/${siteId}/environments/${envId}/database/reset-password`,
    });
  }

  deployments = {
    list: (siteId: string, envId: string, options?: PaginationOptions): Promise<ListResponse<Deployment>> =>
      this.client.request<ListResponse<Deployment>>({
        path: `/api/v1/vector/sites/${siteId}/environments/${envId}/deployments`,
        query: { per_page: options?.perPage, page: options?.page },
      }),

    get: (siteId: string, envId: string, deploymentId: string): Promise<ApiResponse<Deployment>> =>
      this.client.request<ApiResponse<Deployment>>({
        path: `/api/v1/vector/sites/${siteId}/environments/${envId}/deployments/${deploymentId}`,
      }),
  };

  secrets = {
    list: (siteId: string, envId: string, options?: PaginationOptions): Promise<ListResponse<Secret>> =>
      this.client.request<ListResponse<Secret>>({
        path: `/api/v1/vector/sites/${siteId}/environments/${envId}/secrets`,
        query: { per_page: options?.perPage, page: options?.page },
      }),

    create: (siteId: string, envId: string, data: { key: string; value: string }): Promise<ApiResponse<Secret>> =>
      this.client.request<ApiResponse<Secret>>({
        method: 'POST',
        path: `/api/v1/vector/sites/${siteId}/environments/${envId}/secrets`,
        body: data,
      }),

    get: (siteId: string, envId: string, secretId: string): Promise<ApiResponse<Secret>> =>
      this.client.request<ApiResponse<Secret>>({
        path: `/api/v1/vector/sites/${siteId}/environments/${envId}/secrets/${secretId}`,
      }),

    update: (siteId: string, envId: string, secretId: string, data: { key?: string; value?: string }): Promise<ApiResponse<Secret>> =>
      this.client.request<ApiResponse<Secret>>({
        method: 'PUT',
        path: `/api/v1/vector/sites/${siteId}/environments/${envId}/secrets/${secretId}`,
        body: data,
      }),

    delete: (siteId: string, envId: string, secretId: string): Promise<ApiResponse<Secret>> =>
      this.client.request<ApiResponse<Secret>>({
        method: 'DELETE',
        path: `/api/v1/vector/sites/${siteId}/environments/${envId}/secrets/${secretId}`,
      }),
  };
}

class AccountApi {
  constructor(private client: VectorProClient) {}

  getSummary(): Promise<ApiResponse<AccountSummary>> {
    return this.client.request<ApiResponse<AccountSummary>>({ path: '/api/v1/vector/account' });
  }

  sshKeys = {
    list: (options?: PaginationOptions): Promise<ListResponse<SshKey>> =>
      this.client.request<ListResponse<SshKey>>({
        path: '/api/v1/vector/account/ssh-keys',
        query: { per_page: options?.perPage, page: options?.page },
      }),

    create: (data: { name: string; public_key: string }): Promise<ApiResponse<SshKey>> =>
      this.client.request<ApiResponse<SshKey>>({
        method: 'POST',
        path: '/api/v1/vector/account/ssh-keys',
        body: data,
      }),

    get: (keyId: string): Promise<ApiResponse<SshKey>> =>
      this.client.request<ApiResponse<SshKey>>({ path: `/api/v1/vector/account/ssh-keys/${keyId}` }),

    delete: (keyId: string): Promise<ApiResponse<SshKey>> =>
      this.client.request<ApiResponse<SshKey>>({
        method: 'DELETE',
        path: `/api/v1/vector/account/ssh-keys/${keyId}`,
      }),
  };

  apiKeys = {
    list: (options?: PaginationOptions): Promise<ListResponse<ApiKey>> =>
      this.client.request<ListResponse<ApiKey>>({
        path: '/api/v1/vector/account/api-keys',
        query: { per_page: options?.perPage, page: options?.page },
      }),

    create: (data: { name: string; abilities?: string[] }): Promise<ApiResponse<ApiKey>> =>
      this.client.request<ApiResponse<ApiKey>>({
        method: 'POST',
        path: '/api/v1/vector/account/api-keys',
        body: data,
      }),

    delete: (tokenId: number): Promise<ApiResponse<ApiKey>> =>
      this.client.request<ApiResponse<ApiKey>>({
        method: 'DELETE',
        path: `/api/v1/vector/account/api-keys/${tokenId}`,
      }),
  };

  secrets = {
    list: (options?: PaginationOptions): Promise<ListResponse<Secret>> =>
      this.client.request<ListResponse<Secret>>({
        path: '/api/v1/vector/account/secrets',
        query: { per_page: options?.perPage, page: options?.page },
      }),

    create: (data: { key: string; value: string }): Promise<ApiResponse<Secret>> =>
      this.client.request<ApiResponse<Secret>>({
        method: 'POST',
        path: '/api/v1/vector/account/secrets',
        body: data,
      }),

    get: (secretId: string): Promise<ApiResponse<Secret>> =>
      this.client.request<ApiResponse<Secret>>({ path: `/api/v1/vector/account/secrets/${secretId}` }),

    update: (secretId: string, data: { key?: string; value?: string }): Promise<ApiResponse<Secret>> =>
      this.client.request<ApiResponse<Secret>>({
        method: 'PUT',
        path: `/api/v1/vector/account/secrets/${secretId}`,
        body: data,
      }),

    delete: (secretId: string): Promise<ApiResponse<Secret>> =>
      this.client.request<ApiResponse<Secret>>({
        method: 'DELETE',
        path: `/api/v1/vector/account/secrets/${secretId}`,
      }),
  };
}

class WebhooksApi {
  constructor(private client: VectorProClient) {}

  list(options?: PaginationOptions): Promise<ListResponse<Webhook>> {
    return this.client.request<ListResponse<Webhook>>({
      path: '/api/v1/vector/webhooks',
      query: { per_page: options?.perPage, page: options?.page },
    });
  }

  get(webhookId: string): Promise<ApiResponse<Webhook>> {
    return this.client.request<ApiResponse<Webhook>>({ path: `/api/v1/vector/webhooks/${webhookId}` });
  }

  create(data: { type?: string; url: string; events: string[]; enabled?: boolean }): Promise<ApiResponse<Webhook>> {
    return this.client.request<ApiResponse<Webhook>>({
      method: 'POST',
      path: '/api/v1/vector/webhooks',
      body: data,
    });
  }

  update(webhookId: string, data: { url?: string; events?: string[]; enabled?: boolean }): Promise<ApiResponse<Webhook>> {
    return this.client.request<ApiResponse<Webhook>>({
      method: 'PUT',
      path: `/api/v1/vector/webhooks/${webhookId}`,
      body: data,
    });
  }

  delete(webhookId: string): Promise<ApiResponse<Webhook>> {
    return this.client.request<ApiResponse<Webhook>>({
      method: 'DELETE',
      path: `/api/v1/vector/webhooks/${webhookId}`,
    });
  }

  rotateSecret(webhookId: string): Promise<ApiResponse<{ secret?: string }>> {
    return this.client.request<ApiResponse<{ secret?: string }>>({
      method: 'POST',
      path: `/api/v1/vector/webhooks/${webhookId}/rotate-secret`,
    });
  }

  listLogs(webhookId: string, options?: PaginationOptions): Promise<ListResponse<WebhookLog>> {
    return this.client.request<ListResponse<WebhookLog>>({
      path: `/api/v1/vector/webhooks/${webhookId}/logs`,
      query: { per_page: options?.perPage, page: options?.page },
    });
  }
}

class EventsApi {
  constructor(private client: VectorProClient) {}

  list(options?: { from?: string; to?: string; event?: string; perPage?: number; page?: number }): Promise<ListResponse<Event>> {
    return this.client.request<ListResponse<Event>>({
      path: '/api/v1/vector/events',
      query: {
        from: options?.from,
        to: options?.to,
        event: options?.event,
        per_page: options?.perPage,
        page: options?.page,
      },
    });
  }
}

class PhpVersionsApi {
  constructor(private client: VectorProClient) {}

  list(): Promise<ApiResponse<PhpVersion[]>> {
    return this.client.request<ApiResponse<PhpVersion[]>>({ path: '/api/v1/vector/php-versions' });
  }
}
