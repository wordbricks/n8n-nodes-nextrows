# NextRows n8n Community Node - Specification

## Overview

This document specifies the requirements for an n8n community node that integrates with the NextRows web crawling API.

**Package Name:** `n8n-nodes-nextrows`  
**Repository:** https://github.com/wordbricks/n8n-nodes-nextrows  
**Author:** wordbricks (dev@wordbricks.ai)  
**License:** MIT  

---

## Product Description

**NextRows** is a web crawling service that runs pre-configured crawling apps and returns structured data. Users create and configure crawling apps on the NextRows platform, then execute them via API to retrieve scraped data in JSON format.

- **Website:** https://nextrows.com
- **API Documentation:** https://nextrows.com/docs/api/apps/runAppJson
- **App Marketplace:** https://nextrows.com/apps/featured
- **Dashboard (API Keys):** https://nextrows.com/dashboard/overview

---

## API Specification

### Base URL

```
https://api.nextrows.com
```

### Authentication

- **Type:** API Key
- **Header:** `Authorization: Bearer <API_KEY>`
- **Key Source:** Users obtain API keys from https://nextrows.com/dashboard/overview
- **Test Endpoint:** None available (credentials cannot be pre-validated)

### Endpoint: Run App (JSON)

**POST** `/v1/apps/run/json`

Executes a published NextRows app and returns results as an array of JSON objects.

#### Request

```json
{
  "appId": "abc123xyz",
  "inputs": [
    {
      "key": "max-items",
      "value": 10
    },
    {
      "key": "url",
      "value": "https://example.com"
    }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `appId` | string | Yes | The ID of the NextRows app to run |
| `inputs` | array | No | Array of input parameters (key-value pairs) |
| `inputs[].key` | string | Yes | Input parameter name |
| `inputs[].value` | any | Yes | Input parameter value (string, number, or boolean) |

#### Response (Success - 200)

```json
{
  "success": true,
  "data": [
    {
      "Name": "Product A",
      "Price": 29.99,
      "URL": "https://example.com/product-a"
    },
    {
      "Name": "Product B",
      "Price": 49.99,
      "URL": "https://example.com/product-b"
    }
  ],
  "runId": "run_abc123",
  "elapsedTime": 2500
}
```

#### Error Responses

| Status | Error Message |
|--------|---------------|
| 400 | Bad request |
| 401 | Unauthorized |
| 402 | Credits exhausted |
| 404 | App not found |
| 500 | Internal server error |

### Execution Characteristics

- **Type:** Synchronous (long-running)
- **Typical Duration:** 10 seconds to 3 minutes
- **Timeout:** 10 minutes maximum

---

## n8n Node Specification

### Node Metadata

| Property | Value |
|----------|-------|
| Display Name | `NextRows` |
| Internal Name | `nextrows` |
| Description | Run NextRows web crawling apps and retrieve structured data |
| Icon | Custom SVG (primary color: `#F15C06`) |
| Group | `transform` |
| Version | `1` |

### Node UI Design

The node uses a **simple UI** without Resource/Operation dropdowns (single operation only).

#### Parameters

##### 1. App ID

| Property | Value |
|----------|-------|
| Display Name | `App ID` |
| Name | `appId` |
| Type | `string` |
| Required | Yes |
| Default | `''` |
| Description | The ID of the NextRows app to run. Find apps at https://nextrows.com/apps/featured |

##### 2. Inputs (Collection)

| Property | Value |
|----------|-------|
| Display Name | `Inputs` |
| Name | `inputs` |
| Type | `fixedCollection` |
| Required | No |
| Description | Input parameters for the app |

**Collection Item: Input**

| Property | Value |
|----------|-------|
| Display Name | `Input` |
| Name | `input` |
| Type | `collection` |
| Multiple | Yes ("Add Input" button) |

**Fields within each Input:**

| Field | Type | Description |
|-------|------|-------------|
| Key | `string` | Parameter name (e.g., `max-items`) |
| Value | `string` | Parameter value (supports expressions for dynamic values) |

> **Note:** While the API accepts string, number, and boolean values, the n8n UI will accept string input. Users can use n8n expressions to pass numbers/booleans, and the node should attempt to parse JSON values.

### Credentials

#### Credential Type: NextRows API

| Property | Value |
|----------|-------|
| Name | `nextrowsApi` |
| Display Name | `NextRows API` |

**Credential Fields:**

| Field | Type | Description |
|-------|------|-------------|
| API Key | `string` (password) | API key from NextRows dashboard |

**Authentication Configuration:**

```typescript
authenticate: {
  type: 'generic',
  properties: {
    headers: {
      Authorization: '=Bearer {{$credentials.apiKey}}',
    },
  },
}
```

**No credential test** is available (no test endpoint exists).

### Output Specification

The node outputs each row from the API's `data` array as a **separate n8n item** (standard n8n pattern).

**API Response:**
```json
{
  "success": true,
  "data": [
    { "Name": "Product A", "Price": 29.99 },
    { "Name": "Product B", "Price": 49.99 }
  ],
  "runId": "run_abc123",
  "elapsedTime": 2500
}
```

**n8n Output:**
```json
[
  { "json": { "Name": "Product A", "Price": 29.99 } },
  { "json": { "Name": "Product B", "Price": 49.99 } }
]
```

- Only the `data` array is output
- `runId` and `elapsedTime` are **not** included
- Each data object becomes a separate n8n item for downstream processing

### Error Handling

All API errors are handled uniformly with standard n8n error throwing:

- Display the error message from the API response
- No special handling for specific error codes (including 402 Credits exhausted)

### Timeout Configuration

- HTTP request timeout: **10 minutes** (600,000 ms)
- This accommodates long-running crawl operations

---

## Package Structure

```
n8n-nodes-nextrows/
├── package.json
├── tsconfig.json
├── .eslintrc.js
├── README.md
├── LICENSE
├── credentials/
│   └── NextrowsApi.credentials.ts
├── nodes/
│   └── Nextrows/
│       ├── Nextrows.node.ts
│       ├── nextrows.svg
│       └── Nextrows.node.json (codex - optional)
└── dist/                        (compiled output)
```

### package.json Requirements

```json
{
  "name": "n8n-nodes-nextrows",
  "version": "0.1.0",
  "description": "n8n node to run NextRows web crawling apps and retrieve structured data",
  "keywords": [
    "n8n-community-node-package",
    "n8n",
    "nextrows",
    "web-scraping",
    "web-crawling"
  ],
  "license": "MIT",
  "author": {
    "name": "wordbricks",
    "email": "dev@wordbricks.ai"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/wordbricks/n8n-nodes-nextrows.git"
  },
  "main": "index.js",
  "files": [
    "dist"
  ],
  "n8n": {
    "n8nNodesApiVersion": 1,
    "credentials": [
      "dist/credentials/NextrowsApi.credentials.js"
    ],
    "nodes": [
      "dist/nodes/Nextrows/Nextrows.node.js"
    ]
  }
}
```

---

## Implementation Notes

### Input Value Parsing

The `inputs` parameter values should support:
1. Plain strings: `"hello"`
2. Numbers (as strings that get parsed): `"10"` → `10`
3. Booleans (as strings that get parsed): `"true"` → `true`
4. JSON values via n8n expressions: `{{ $json.count }}`

**Recommended approach:** Try to parse the value as JSON first; if parsing fails, use it as a string.

```typescript
function parseInputValue(value: string): string | number | boolean {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
```

### HTTP Request Configuration

```typescript
const options: IRequestOptions = {
  method: 'POST',
  url: 'https://api.nextrows.com/v1/apps/run/json',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: {
    appId: appId,
    inputs: inputs,
  },
  json: true,
  timeout: 600000, // 10 minutes
};
```

### Branding

- **Primary Color:** `#F15C06` (orange)
- **Icon:** Create a simple SVG icon using the primary color
- **Display Name:** `NextRows`

---

## Future Enhancements (Out of Scope)

The following features are explicitly **not included** in the initial version:

1. **Run App (Table)** endpoint (`/v1/apps/run/table`)
2. **Extract Data** endpoint (`/v1/extract`)
3. **Credit Usage** endpoint (`/v1/credits`)
4. Credential test/validation
5. Special error handling for specific error codes

These may be added in future versions.

---

## Testing Checklist

- [ ] Node appears in n8n node palette
- [ ] Credentials can be saved
- [ ] App ID field accepts input
- [ ] Multiple inputs can be added via "Add Input" button
- [ ] API call executes successfully with valid credentials
- [ ] Response data is correctly split into separate n8n items
- [ ] Long-running requests (up to 3 min) complete successfully
- [ ] Errors are displayed appropriately
- [ ] Node works with n8n expressions in input values

---

## References

- [NextRows API Documentation](https://nextrows.com/docs/api/apps/runAppJson)
- [NextRows App Marketplace](https://nextrows.com/apps/featured)
- [NextRows Dashboard](https://nextrows.com/dashboard/overview)
- [n8n Community Node Documentation](https://docs.n8n.io/integrations/creating-nodes/overview/)
- [n8n Node Development Guide](https://docs.n8n.io/integrations/creating-nodes/build/programmatic-style-node/)
