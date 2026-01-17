import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { VectorProClient, VectorProError } from '../src/index.js';

describe('VectorProClient', () => {
  let client: VectorProClient;
  const mockFetch = vi.fn();

  beforeEach(() => {
    client = new VectorProClient({ apiKey: 'test-api-key' });
    globalThis.fetch = mockFetch;
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should use default base URL', () => {
      const c = new VectorProClient({ apiKey: 'test' });
      expect(c).toBeInstanceOf(VectorProClient);
    });

    it('should allow custom base URL', () => {
      const c = new VectorProClient({
        apiKey: 'test',
        baseUrl: 'https://custom.api.com',
      });
      expect(c).toBeInstanceOf(VectorProClient);
    });
  });

  describe('getSites', () => {
    it('should fetch sites successfully', async () => {
      const mockResponse = {
        data: [
          {
            id: 'site-123',
            account_id: 1,
            vector_cluster_id: 'cluster-456',
            partner_customer_id: 'cust-789',
            status: 'active',
            tags: ['wordpress'],
            dev_domain: 'site.dev.example.com',
            environments: [],
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-01T00:00:00Z',
          },
        ],
        links: {},
        meta: { total: 1 },
        message: 'Success',
        http_status: 200,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.getSites();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.builtfast.com/api/v1/vector/sites',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-api-key',
            Accept: 'application/json',
          }),
        })
      );

      expect(result.data).toHaveLength(1);
      expect(result.data[0]?.id).toBe('site-123');
    });

    it('should pass pagination params', async () => {
      const mockResponse = {
        data: [],
        links: {},
        meta: {},
        message: 'Success',
        http_status: 200,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await client.getSites({ page: 2, per_page: 50 });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.builtfast.com/api/v1/vector/sites?page=2&per_page=50',
        expect.any(Object)
      );
    });
  });

  describe('getSite', () => {
    it('should fetch a single site', async () => {
      const mockResponse = {
        data: {
          id: 'site-123',
          account_id: 1,
          vector_cluster_id: 'cluster-456',
          partner_customer_id: 'cust-789',
          status: 'active',
          tags: [],
          dev_domain: 'site.dev.example.com',
          environments: [],
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
        message: 'Success',
        http_status: 200,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.getSite('site-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.builtfast.com/api/v1/vector/sites/site-123',
        expect.any(Object)
      );

      expect(result.id).toBe('site-123');
    });
  });

  describe('createSite', () => {
    it('should create a site', async () => {
      const mockResponse = {
        data: {
          id: 'site-new',
          account_id: 1,
          vector_cluster_id: 'cluster-456',
          partner_customer_id: 'cust-new',
          status: 'pending',
          tags: ['test'],
          dev_domain: 'new.dev.example.com',
          dev_db_username: 'db-user',
          dev_db_password: 'db-pass',
          environments: [],
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
        message: 'Created',
        http_status: 201,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.createSite({
        partner_customer_id: 'cust-new',
        dev_php_version: '8.3',
        tags: ['test'],
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.builtfast.com/api/v1/vector/sites',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            partner_customer_id: 'cust-new',
            dev_php_version: '8.3',
            tags: ['test'],
          }),
        })
      );

      expect(result.id).toBe('site-new');
      expect(result.dev_db_password).toBe('db-pass');
    });
  });

  describe('error handling', () => {
    it('should throw VectorProError on 401', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          data: {},
          message: 'Unauthenticated',
          http_status: 401,
        }),
      });

      await expect(client.getSites()).rejects.toThrow(VectorProError);

      try {
        await client.getSites();
      } catch (err) {
        // Already caught above
      }
    });

    it('should throw VectorProError on 404', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          data: {},
          message: 'Site not found',
          http_status: 404,
        }),
      });

      try {
        await client.getSite('nonexistent');
      } catch (err) {
        expect(err).toBeInstanceOf(VectorProError);
        const error = err as VectorProError;
        expect(error.isNotFoundError()).toBe(true);
        expect(error.message).toBe('Site not found');
      }
    });

    it('should throw VectorProError on 422 validation error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: async () => ({
          data: {},
          errors: {
            partner_customer_id: ['The partner customer id field is required.'],
            dev_php_version: ['The dev php version field is required.'],
          },
          message: 'Validation failed',
          http_status: 422,
        }),
      });

      try {
        await client.createSite({} as Parameters<typeof client.createSite>[0]);
      } catch (err) {
        expect(err).toBeInstanceOf(VectorProError);
        const error = err as VectorProError;
        expect(error.isValidationError()).toBe(true);
        expect(error.getValidationErrors()).toHaveProperty('partner_customer_id');
        expect(error.firstError()).toBe('The partner customer id field is required.');
        expect(error.hasErrorFor('partner_customer_id')).toBe(true);
        expect(error.hasErrorFor('nonexistent')).toBe(false);
        expect(error.errorsFor('dev_php_version')).toContain('The dev php version field is required.');
      }
    });
  });

  describe('environments', () => {
    it('should list environments', async () => {
      const mockResponse = {
        data: [
          {
            id: 'env-123',
            vector_site_id: 'site-123',
            name: 'production',
            is_production: true,
            status: 'active',
            php_version: '8.3',
            fqdn: 'prod.example.com',
            subdomain: 'prod',
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-01T00:00:00Z',
          },
        ],
        links: {},
        meta: {},
        message: 'Success',
        http_status: 200,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.getEnvironments('site-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.builtfast.com/api/v1/vector/sites/site-123/environments',
        expect.any(Object)
      );

      expect(result.data).toHaveLength(1);
      expect(result.data[0]?.name).toBe('production');
    });

    it('should create environment', async () => {
      const mockResponse = {
        data: {
          id: 'env-new',
          vector_site_id: 'site-123',
          name: 'staging',
          is_production: false,
          status: 'pending',
          php_version: '8.3',
          fqdn: 'staging.example.com',
          subdomain: 'staging',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
        message: 'Created',
        http_status: 201,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.createEnvironment('site-123', {
        name: 'staging',
        php_version: '8.3',
      });

      expect(result.name).toBe('staging');
    });
  });

  describe('deployments', () => {
    it('should create deployment', async () => {
      const mockResponse = {
        data: {
          id: 'deploy-123',
          vector_environment_id: 'env-123',
          status: 'pending',
          stdout: null,
          stderr: null,
          actor: 'user@example.com',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
        message: 'Deployment initiated',
        http_status: 201,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.createDeployment('site-123', 'production');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.builtfast.com/api/v1/vector/sites/site-123/environments/production/deployments',
        expect.objectContaining({ method: 'POST' })
      );

      expect(result.status).toBe('pending');
    });

    it('should rollback deployment', async () => {
      const mockResponse = {
        data: {
          id: 'deploy-rollback',
          vector_environment_id: 'env-123',
          status: 'pending',
          stdout: null,
          stderr: null,
          actor: 'user@example.com',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
        message: 'Rollback initiated',
        http_status: 201,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.rollbackDeployment('site-123', 'production', {
        target_deployment_id: 'deploy-old',
      });

      expect(result.id).toBe('deploy-rollback');
    });
  });

  describe('webhooks', () => {
    it('should create webhook', async () => {
      const mockResponse = {
        data: {
          id: 'webhook-123',
          type: 'http',
          url: 'https://example.com/webhook',
          events: ['vector.site.created'],
          secret: 'whsec_123',
          is_active: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
        message: 'Created',
        http_status: 201,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.createWebhook({
        type: 'http',
        url: 'https://example.com/webhook',
        events: ['vector.site.created'],
      });

      expect(result.id).toBe('webhook-123');
      expect(result.secret).toBe('whsec_123');
    });

    it('should rotate webhook secret', async () => {
      const mockResponse = {
        data: {
          id: 'webhook-123',
          type: 'http',
          url: 'https://example.com/webhook',
          events: ['vector.site.created'],
          secret: 'whsec_new',
          is_active: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
        message: 'Secret rotated',
        http_status: 200,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.rotateWebhookSecret('webhook-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.builtfast.com/api/v1/vector/webhooks/webhook-123/rotate-secret',
        expect.objectContaining({ method: 'POST' })
      );

      expect(result.secret).toBe('whsec_new');
    });
  });

  describe('WAF', () => {
    it('should add blocked IP', async () => {
      const mockResponse = {
        data: {
          ip: '1.2.3.4',
          note: 'Suspicious activity',
        },
        message: 'IP blocked',
        http_status: 201,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.addBlockedIp('site-123', '1.2.3.4', 'Suspicious activity');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.builtfast.com/api/v1/vector/sites/site-123/waf/blocked-ips',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ ip: '1.2.3.4', note: 'Suspicious activity' }),
        })
      );

      expect(result.ip).toBe('1.2.3.4');
    });

    it('should create rate limit', async () => {
      const mockResponse = {
        data: {
          id: 'rl-123',
          path_pattern: '/api/*',
          requests_per_minute: 100,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
        message: 'Created',
        http_status: 201,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.createRateLimit('site-123', {
        path_pattern: '/api/*',
        requests_per_minute: 100,
      });

      expect(result.path_pattern).toBe('/api/*');
      expect(result.requests_per_minute).toBe(100);
    });
  });
});

describe('VectorProError', () => {
  it('should create error with status code and response body', () => {
    const error = new VectorProError(422, {
      data: {},
      errors: { name: ['Name is required'] },
      message: 'Validation failed',
      http_status: 422,
    });

    expect(error.statusCode).toBe(422);
    expect(error.message).toBe('Validation failed');
    expect(error.name).toBe('VectorProError');
  });

  it('should identify error types correctly', () => {
    const authError = new VectorProError(401, {
      data: {},
      message: 'Unauthenticated',
      http_status: 401,
    });
    expect(authError.isAuthenticationError()).toBe(true);
    expect(authError.isAuthorizationError()).toBe(false);

    const forbiddenError = new VectorProError(403, {
      data: {},
      message: 'Forbidden',
      http_status: 403,
    });
    expect(forbiddenError.isAuthorizationError()).toBe(true);

    const notFoundError = new VectorProError(404, {
      data: {},
      message: 'Not found',
      http_status: 404,
    });
    expect(notFoundError.isNotFoundError()).toBe(true);

    const validationError = new VectorProError(422, {
      data: {},
      errors: {},
      message: 'Validation failed',
      http_status: 422,
    });
    expect(validationError.isValidationError()).toBe(true);

    const serverError = new VectorProError(500, {
      data: {},
      message: 'Server error',
      http_status: 500,
    });
    expect(serverError.isServerError()).toBe(true);
  });

  it('should handle validation errors', () => {
    const error = new VectorProError(422, {
      data: {},
      errors: {
        name: ['Name is required', 'Name must be at least 3 characters'],
        email: ['Email is invalid'],
      },
      message: 'Validation failed',
      http_status: 422,
    });

    expect(error.getValidationErrors()).toEqual({
      name: ['Name is required', 'Name must be at least 3 characters'],
      email: ['Email is invalid'],
    });

    expect(error.firstError()).toBe('Name is required');
    expect(error.errorsFor('name')).toEqual([
      'Name is required',
      'Name must be at least 3 characters',
    ]);
    expect(error.errorsFor('email')).toEqual(['Email is invalid']);
    expect(error.errorsFor('nonexistent')).toEqual([]);

    expect(error.hasErrorFor('name')).toBe(true);
    expect(error.hasErrorFor('email')).toBe(true);
    expect(error.hasErrorFor('nonexistent')).toBe(false);
  });

  it('should handle errors without validation errors', () => {
    const error = new VectorProError(404, {
      data: {},
      message: 'Not found',
      http_status: 404,
    });

    expect(error.getValidationErrors()).toEqual({});
    expect(error.firstError()).toBeNull();
    expect(error.errorsFor('anything')).toEqual([]);
    expect(error.hasErrorFor('anything')).toBe(false);
  });
});
