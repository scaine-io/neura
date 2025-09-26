import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { ResourceLoginResponse } from './interfaces/ResourceLoginResponse'
import { EdgeCloudResponse } from './interfaces/EdgeCloudResponse'
import { ResourceListResponse } from './interfaces/ResourceListReponse'

export class Resource {
	private tecPlatformServiceClient: AxiosInstance

	constructor(apiKey: string) {
		this.tecPlatformServiceClient = axios.create({
			baseURL: 'https://api.thetaedgecloud.com',
			headers: {
				'x-api-key': apiKey.trim(), // todo: check if not auth-token
			},
		})
	}

	async listVMs(): Promise<ResourceListResponse> {
		try {
			const response = (await this.tecPlatformServiceClient.get('/resource/vm/list')) as AxiosResponse
			const body = response.data as EdgeCloudResponse
			if (body.status !== 'success') {
				throw new Error(`API responded with status: ${response.status}`)
			}

			return body.body as ResourceListResponse
		} catch (err: any) {
			throw new Error(`Failed to list machine types: ${err.message}`)
		}
	}

	// https://api.thetaedgecloud.com/user/login
	async login(email: string, password: string): Promise<ResourceLoginResponse> {
		try {
			const response = (await this.tecPlatformServiceClient.post('/user/login', {
				email,
				password,
			})) as AxiosResponse

			const body = response.data as EdgeCloudResponse
			if (body.status !== 'success') throw new Error(`API responded with status: ${response.status}`)
			return body.body as ResourceLoginResponse
		} catch (err: any) {
			throw new Error(`Login failed: ${err.message}`)
		}
	}
}
