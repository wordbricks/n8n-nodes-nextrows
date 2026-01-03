import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
	IDataObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export class Nextrows implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'NextRows',
		name: 'nextrows',
		icon: { light: 'file:nextrows.svg', dark: 'file:nextrows.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: 'Run App',
		description: 'Run NextRows web crawling apps and retrieve structured data',
		defaults: {
			name: 'NextRows',
		},
		usableAsTool: true,
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
				required: true,
				default: '',
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
								description: 'The name of the input parameter',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								placeholder: 'e.g., 10',
								description:
									'The value of the input parameter. Supports strings, numbers, and booleans.',
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
				const appId = this.getNodeParameter('appId', i) as string;
				const inputsCollection = this.getNodeParameter('inputs', i) as {
					inputValues?: Array<{ key: string; value: string }>;
				};

				// Build the inputs array with parsed values
				const inputs: Array<{ key: string; value: string | number | boolean }> = [];

				if (inputsCollection.inputValues) {
					for (const input of inputsCollection.inputValues) {
						inputs.push({
							key: input.key,
							value: parseInputValue(input.value),
						});
					}
				}

				// Make the API request
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'nextrowsApi',
					{
						method: 'POST' as IHttpRequestMethods,
						url: 'https://api.nextrows.com/v1/apps/run/json',
						body: {
							appId,
							inputs,
						},
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
						timeout: 600000, // 10 minutes timeout for long-running crawls
					},
				);

				// Check for success
				if (!response.success) {
					throw new NodeOperationError(
						this.getNode(),
						(response.error as string) || 'Unknown error occurred',
						{ itemIndex: i },
					);
				}

				// Extract data array and return each item separately (standard n8n pattern)
				const data = response.data as IDataObject[];

				if (Array.isArray(data)) {
					for (const item of data) {
						returnData.push({
							json: item,
							pairedItem: { item: i },
						});
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
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

/**
 * Parse input value to appropriate type.
 * Tries to parse as JSON (for numbers, booleans, objects, arrays).
 * Falls back to string if parsing fails.
 */
function parseInputValue(value: string): string | number | boolean {
	if (value === '') {
		return value;
	}

	try {
		const parsed: unknown = JSON.parse(value);
		// Only return parsed value if it's a primitive type
		if (
			typeof parsed === 'number' ||
			typeof parsed === 'boolean' ||
			typeof parsed === 'string'
		) {
			return parsed;
		}
		// For objects/arrays, return as string (API might expect JSON string)
		return value;
	} catch {
		// Not valid JSON, return as string
		return value;
	}
}
