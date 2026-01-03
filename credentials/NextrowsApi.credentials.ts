import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class NextrowsApi implements ICredentialType {
	name = 'nextrowsApi';

	displayName = 'NextRows API';

	documentationUrl = 'https://github.com/wordbricks/n8n-nodes-nextrows#credentials';

	icon: Icon = { light: 'file:nextrows.svg', dark: 'file:nextrows.dark.svg' };

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'Your NextRows API key. Get it from https://nextrows.com/dashboard/overview',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.nextrows.com',
			url: '/v1/credits',
			method: 'GET',
		},
	};
}
