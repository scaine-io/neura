import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { ResourceLoginResponse } from './interfaces/ResourceLoginResponse'
import { EdgeCloudResponse } from './interfaces/Response'

interface MachineType {
	id: string
	name: string
	// Add other properties as needed
}

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

	async listMachineTypes(): Promise<MachineType[]> {
		const response = await this.tecPlatformServiceClient.get('/resource/vm/list')
		return response.data
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
