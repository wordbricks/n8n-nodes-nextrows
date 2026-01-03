import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	NodeApiError,
} from 'n8n-workflow';

/**
 * Parse input value - attempts to parse as JSON (for numbers, booleans),
 * falls back to string if parsing fails
 */
function parseInputValue(value: string): string | number | boolean {
	if (value === '') return value;
	try {
		const parsed = JSON.parse(value);
		// Only accept primitives (string, number, boolean)
		if (typeof parsed === 'string' || typeof parsed === 'number' || typeof parsed === 'boolean') {
			return parsed;
		}
		return value;
	} catch {
		return value;
	}
}

export class Nextrows implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'NextRows',
		name: 'nextrows',
		icon: 'file:nextrows.svg',
		group: ['transform'],
		version: 1,
		subtitle: 'Run web crawling app',
		description: 'Run NextRows web crawling apps and retrieve structured data',
		defaults: {
			name: 'NextRows',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'nextrowsApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'App ID',
				name: 'appId',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'e.g., abc123xyz',
				description:
					'The ID of the NextRows app to run. Find apps at <a href="https://nextrows.com/apps/featured" target="_blank">NextRows Marketplace</a>.',
			},
			{
				displayName: 'Inputs',
				name: 'inputs',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				placeholder: 'Add Input',
				description: 'Input parameters for the app',
				options: [
					{
						name: 'inputValues',
						displayName: 'Input',
						values: [
							{
								displayName: 'Key',
								name: 'key',
								type: 'string',
								default: '',
								placeholder: 'e.g., max-items',
								description: 'Parameter name',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								placeholder: 'e.g., 10',
								description:
									'Parameter value (supports strings, numbers, booleans, and expressions)',
							},
						],
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				// Get parameters
				const appId = this.getNodeParameter('appId', i) as string;
				const inputsCollection = this.getNodeParameter('inputs', i) as {
					inputValues?: Array<{ key: string; value: string }>;
				};

				// Build inputs array for API
				const inputs: Array<{ key: string; value: string | number | boolean }> = [];
				if (inputsCollection.inputValues) {
					for (const input of inputsCollection.inputValues) {
						if (input.key) {
							inputs.push({
								key: input.key,
								value: parseInputValue(input.value),
							});
						}
					}
				}

				// Get credentials
				const credentials = await this.getCredentials('nextrowsApi');
				const apiKey = credentials.apiKey as string;

				// Make API request
				const response = await this.helpers.httpRequest({
					method: 'POST',
					url: 'https://api.nextrows.com/v1/apps/run/json',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						Authorization: `Bearer ${apiKey}`,
					},
					body: {
						appId,
						inputs,
					},
					timeout: 600000, // 10 minutes
				});

				// Check for API error response
				if (response.success === false) {
					throw new NodeApiError(this.getNode(), {
						message: response.error || 'API request failed',
					});
				}

				// Extract data array and convert each item to n8n format
				const data = response.data as IDataObject[];
				if (Array.isArray(data)) {
					for (const dataItem of data) {
						returnData.push({
							json: dataItem,
							pairedItem: { item: i },
						});
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					returnData.push({
						json: {
							error: errorMessage,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
