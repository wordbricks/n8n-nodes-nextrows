import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class NextrowsApi implements ICredentialType {
	name = 'nextrowsApi';
	displayName = 'NextRows API';
	documentationUrl = 'https://nextrows.com/docs/api/apps/runAppJson';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'API key from NextRows dashboard (https://nextrows.com/dashboard/overview)',
		},
	];
}
