# n8n-nodes-nextrows

This is an n8n community node that lets you use [NextRows](https://nextrows.com) in your n8n workflows.

NextRows is a web crawling service that runs pre-configured crawling apps and returns structured data.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### npm

```bash
npm install n8n-nodes-nextrows
```

### n8n Community Nodes

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-nextrows` and confirm

## Operations

### Run App (JSON)

Executes a published NextRows app and returns the crawled data as structured JSON.

**Parameters:**

| Parameter | Description |
|-----------|-------------|
| App ID | The ID of the NextRows app to run |
| Inputs | Optional key-value pairs to pass to the app (e.g., `max-items: 10`) |

**Output:**

Each row of crawled data is returned as a separate n8n item, allowing you to process each item individually in subsequent nodes.

## Credentials

To use this node, you need a NextRows API key:

1. Sign up at [NextRows](https://nextrows.com)
2. Go to your [Dashboard](https://nextrows.com/dashboard/overview)
3. Copy your API key
4. In n8n, create new credentials for "NextRows API" and paste your key

## Compatibility

- Requires n8n version 1.0.0 or later
- Node.js 18.17.0 or later

## Usage

### Basic Example

1. Add the **NextRows** node to your workflow
2. Configure your NextRows API credentials
3. Enter the App ID of the crawling app you want to run
4. (Optional) Add input parameters like `max-items`
5. Execute the workflow

### Finding App IDs

Browse the [NextRows App Marketplace](https://nextrows.com/apps/featured) to find apps and their IDs.

## Resources

- [NextRows Website](https://nextrows.com)
- [NextRows API Documentation](https://nextrows.com/docs/api/apps/runAppJson)
- [NextRows App Marketplace](https://nextrows.com/apps/featured)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE)
