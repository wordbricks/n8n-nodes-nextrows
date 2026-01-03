# n8n-nodes-nextrows

This is an n8n community node. It lets you use [NextRows](https://nextrows.com) in your n8n workflows.

**NextRows** is a web crawling service that runs pre-configured crawling apps and returns structured data. Create or discover crawling apps on the NextRows platform, then execute them via this node to retrieve scraped data in JSON format.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Quick Install

In your n8n instance:
1. Go to **Settings** > **Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-nextrows`
4. Select **Install**

## Operations

### Run App (JSON)

Executes a published NextRows crawling app and returns the results as structured JSON data.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| App ID | String | Yes | The ID of the NextRows app to run |
| Inputs | Collection | No | Key-value pairs for app input parameters |

**Output:**

Each row from the crawled data is returned as a separate n8n item, allowing you to process each result individually in subsequent nodes.

## Credentials

To use this node, you need a NextRows API key.

### Getting Your API Key

1. Sign up or log in at [NextRows](https://nextrows.com)
2. Navigate to [Dashboard](https://nextrows.com/dashboard/overview)
3. Copy your API key

### Setting Up Credentials in n8n

1. In n8n, go to **Credentials**
2. Select **Add Credential**
3. Search for **NextRows API**
4. Paste your API key
5. Save

## Compatibility

- **Minimum n8n version:** 1.0.0
- **Tested with:** Latest n8n version

## Usage

### Basic Example

1. Add the **NextRows** node to your workflow
2. Configure your NextRows API credentials
3. Enter the **App ID** of the crawling app you want to run
4. (Optional) Add input parameters if the app requires them
5. Execute the node

### Finding Apps

Browse available crawling apps at the [NextRows Marketplace](https://nextrows.com/apps/featured).

### Input Parameters

Many NextRows apps accept input parameters to customize the crawl. Common inputs include:

- `max-items` - Maximum number of items to return
- `url` - Target URL to crawl
- Custom parameters defined by the specific app

Input values support:
- Strings: `"hello"`
- Numbers: `10` (enter without quotes)
- Booleans: `true` or `false`
- n8n expressions: `{{ $json.myValue }}`

### Handling Long-Running Crawls

Web crawling can take anywhere from 10 seconds to 3 minutes depending on the app and target website. The node is configured with a 10-minute timeout to accommodate long-running operations.

### Example Workflow

```
[Trigger] → [NextRows] → [Process Items] → [Output]
```

1. **Trigger**: Start your workflow (manual, schedule, webhook, etc.)
2. **NextRows**: Run a crawling app to extract data
3. **Process Items**: Transform or filter the extracted data
4. **Output**: Save to database, send to API, etc.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [NextRows Website](https://nextrows.com)
- [NextRows API Documentation](https://nextrows.com/docs/api/apps/runAppJson)
- [NextRows App Marketplace](https://nextrows.com/apps/featured)
- [GitHub Repository](https://github.com/wordbricks/n8n-nodes-nextrows)

## Version history

### 0.1.0

- Initial release
- Support for Run App (JSON) endpoint
- Dynamic input parameters
