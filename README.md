<p align="center">
    <img alt="BuiltFast Logo Light Mode" src="/assets/images/logo-light-mode.svg#gh-light-mode-only"/>
    <img alt="BuiltFast Logo Dark Mode" src="/assets/images/logo-dark-mode.svg#gh-dark-mode-only"/>
</p>

# Vector Pro SDK for Node.js

Official Node.js SDK for [Vector Pro](https://builtfast.dev/api) by [BuiltFast](https://builtfast.com).

[![npm version](https://img.shields.io/npm/v/vector-pro-sdk.svg)](https://www.npmjs.com/package/vector-pro-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install vector-pro-sdk
```

## Usage

```typescript
import { VectorProClient } from 'vector-pro-sdk';

const client = new VectorProClient({
  apiKey: 'your-api-key',
});

// List sites
const sites = await client.sites.list();

// Create a site
const site = await client.sites.create({
  partner_customer_id: 'customer-123',
  dev_php_version: '8.3',
});

// Get a specific site
const site = await client.sites.get('site-id');

// Manage environments
const envs = await client.environments.list('site-id');
await client.environments.deploy('env-id');
await client.environments.rollback('env-id');

// Database operations
await client.sites.db.createExport('site-id');
await client.sites.db.importDirect('site-id', { dropTables: true });

// WAF management
await client.sites.waf.addBlockedIP('site-id', '1.2.3.4');
await client.sites.waf.listRateLimits('site-id');

// SSH keys
await client.sites.sshKeys.add('site-id', {
  name: 'my-key',
  public_key: 'ssh-rsa ...',
});

// Account management
const summary = await client.account.getSummary();
await client.account.apiKeys.create({ name: 'ci-token' });
await client.account.secrets.create({ key: 'MY_SECRET', value: 'secret-value' });

// Webhooks
await client.webhooks.create({
  url: 'https://example.com/webhook',
  events: ['site.created', 'deployment.completed'],
});
```

## API Reference

### Sites

- `client.sites.list(options?)` - List all sites
- `client.sites.get(siteId)` - Get a site
- `client.sites.create(data)` - Create a site
- `client.sites.update(siteId, data)` - Update a site
- `client.sites.delete(siteId)` - Delete a site
- `client.sites.clone(siteId, data?)` - Clone a site
- `client.sites.suspend(siteId)` - Suspend a site
- `client.sites.unsuspend(siteId)` - Unsuspend a site
- `client.sites.getLogs(siteId, options?)` - Get site logs
- `client.sites.purgeCache(siteId, options?)` - Purge CDN cache

### Sites - Database

- `client.sites.db.importDirect(siteId, options?)` - Import SQL directly
- `client.sites.db.createImportSession(siteId, data?)` - Create import session for large files
- `client.sites.db.runImport(siteId, importId)` - Run a pending import
- `client.sites.db.getImportStatus(siteId, importId)` - Get import status
- `client.sites.db.createExport(siteId, options?)` - Create database export
- `client.sites.db.getExportStatus(siteId, exportId)` - Get export status

### Sites - WAF

- `client.sites.waf.listAllowedReferrers(siteId)` - List allowed referrers
- `client.sites.waf.addAllowedReferrer(siteId, hostname)` - Add allowed referrer
- `client.sites.waf.removeAllowedReferrer(siteId, hostname)` - Remove allowed referrer
- `client.sites.waf.listBlockedReferrers(siteId)` - List blocked referrers
- `client.sites.waf.addBlockedReferrer(siteId, hostname)` - Add blocked referrer
- `client.sites.waf.removeBlockedReferrer(siteId, hostname)` - Remove blocked referrer
- `client.sites.waf.listBlockedIPs(siteId)` - List blocked IPs
- `client.sites.waf.addBlockedIP(siteId, ip)` - Add blocked IP
- `client.sites.waf.removeBlockedIP(siteId, ip)` - Remove blocked IP
- `client.sites.waf.listRateLimits(siteId)` - List rate limits
- `client.sites.waf.createRateLimit(siteId, data)` - Create rate limit
- `client.sites.waf.getRateLimit(siteId, ruleId)` - Get rate limit
- `client.sites.waf.updateRateLimit(siteId, ruleId, data)` - Update rate limit
- `client.sites.waf.deleteRateLimit(siteId, ruleId)` - Delete rate limit

### Sites - SSH Keys

- `client.sites.sshKeys.list(siteId, options?)` - List SSH keys
- `client.sites.sshKeys.add(siteId, data)` - Add SSH key
- `client.sites.sshKeys.remove(siteId, keyId)` - Remove SSH key

### Sites - SSL

- `client.sites.ssl.getStatus(envId)` - Get SSL status
- `client.sites.ssl.nudge(envId, options?)` - Nudge SSL provisioning

### Environments

- `client.environments.list(siteId, options?)` - List environments
- `client.environments.get(envId)` - Get an environment
- `client.environments.create(siteId, data)` - Create an environment
- `client.environments.update(envId, data)` - Update an environment
- `client.environments.delete(envId)` - Delete an environment
- `client.environments.deploy(envId)` - Deploy an environment
- `client.environments.rollback(envId, targetDeploymentId?)` - Rollback deployment
- `client.environments.resetDatabasePassword(envId)` - Reset database password

### Environments - Deployments

- `client.environments.deployments.list(envId, options?)` - List deployments
- `client.environments.deployments.get(deploymentId)` - Get deployment

### Environments - Secrets

- `client.environments.secrets.list(envId, options?)` - List secrets
- `client.environments.secrets.create(envId, data)` - Create secret
- `client.environments.secrets.get(secretId)` - Get secret
- `client.environments.secrets.update(secretId, data)` - Update secret
- `client.environments.secrets.delete(secretId)` - Delete secret

### Account

- `client.account.getSummary()` - Get account summary
- `client.account.sshKeys.list(options?)` - List account SSH keys
- `client.account.sshKeys.create(data)` - Create SSH key
- `client.account.sshKeys.get(keyId)` - Get SSH key
- `client.account.sshKeys.delete(keyId)` - Delete SSH key
- `client.account.apiKeys.list(options?)` - List API keys
- `client.account.apiKeys.create(data)` - Create API key
- `client.account.apiKeys.delete(tokenId)` - Delete API key
- `client.account.secrets.list(options?)` - List global secrets
- `client.account.secrets.create(data)` - Create global secret
- `client.account.secrets.get(secretId)` - Get global secret
- `client.account.secrets.update(secretId, data)` - Update global secret
- `client.account.secrets.delete(secretId)` - Delete global secret

### Webhooks

- `client.webhooks.list(options?)` - List webhooks
- `client.webhooks.get(webhookId)` - Get a webhook
- `client.webhooks.create(data)` - Create a webhook
- `client.webhooks.update(webhookId, data)` - Update a webhook
- `client.webhooks.delete(webhookId)` - Delete a webhook
- `client.webhooks.rotateSecret(webhookId)` - Rotate webhook secret
- `client.webhooks.listLogs(webhookId, options?)` - List webhook delivery logs

### Events

- `client.events.list(options?)` - List events

### PHP Versions

- `client.phpVersions.list()` - List available PHP versions

## TypeScript

Full TypeScript support with exported types for all API responses:

```typescript
import { VectorProClient } from 'vector-pro-sdk';
import type { Site, Environment, ApiResponse, ListResponse } from 'vector-pro-sdk';

const client = new VectorProClient({ apiKey: 'your-api-key' });

// Responses are fully typed
const sites: ListResponse<Site> = await client.sites.list();
const site: ApiResponse<Site> = await client.sites.get('site-id');

// Access typed data
sites.data?.forEach(site => {
  console.log(site.id, site.status);
});
```

## Error Handling

```typescript
import { VectorProClient, VectorProApiError } from 'vector-pro-sdk';

try {
  await client.sites.get('invalid-id');
} catch (error) {
  if (error instanceof VectorProApiError) {
    console.log(error.status);  // HTTP status code
    console.log(error.body);    // Response body
  }
}
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build
```

## License

MIT - see [LICENSE](LICENSE) for details.
