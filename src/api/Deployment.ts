import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { DeploymentListResponse } from './interfaces/DeploymentListResponse'
import { DeploymentRequest } from './interfaces/DeploymentRequest'
import { DeploymentTemplateResponse } from './interfaces/DeploymentTemplateResponse'
import { EdgeCloudResponse } from './interfaces/Response'

export class Deployment {
	private tecControllerClient: AxiosInstance
	private projectId: string

	constructor(token: string, projectId: string, userId: string) {
		this.tecControllerClient = axios.create({
			baseURL: 'https://controller.thetaedgecloud.com',
			headers: {
				'x-auth-token': token.toString().trim(),
				'x-auth-id': userId.trim(),
			},
		})
		this.projectId = projectId.trim()
	}

	async create(data: DeploymentRequest): Promise<DeploymentListResponse> {
		const response = await this.tecControllerClient.post('/deployment', data)
		return response.data
	}

	async list(notTemplateName: string[] = ['Jupyter Notebook', 'GPU Node']): Promise<DeploymentListResponse[]> {
		try {
			const queryParams = notTemplateName.map((name) => `not_template_name=${encodeURIComponent(name)}`).join('&')
			const response = await this.tecControllerClient.get(`/deployment/list?${queryParams}&project_id=${this.projectId}`) as AxiosResponse
			const body = response.data as EdgeCloudResponse

			if (body.status !== 'success') throw new Error(`API responded with status: ${response.status}`)

			return body.body as DeploymentListResponse[]
		} catch (err: any) {
			throw new Error(`Failed to list deployments: ${err.message}`)
		}
	}

	async stop(shard: string, suffix: string): Promise<DeploymentListResponse[]> {
		try {
			const response = await this.tecControllerClient.put(`/deployment/${shard}/${suffix}/stop?project_id=${this.projectId}`) as AxiosResponse
			const body = response.data as EdgeCloudResponse

			if (body.status !== 'success') throw new Error(`API responded with status: ${response.status}`)
			return body.body as DeploymentListResponse[]
		} catch (err: any) {
			throw new Error(`Failed to stop deployment: ${err.message}`)
		}
	}

	async remove(shard: string, suffix: string): Promise<DeploymentListResponse[]> {
		try {
			const response = await this.tecControllerClient.delete(`/deployment/${shard}/${suffix}?project_id=${this.projectId}`) as AxiosResponse
			const body = response.data as EdgeCloudResponse

			if (body.status !== 'success') throw new Error(`API responded with status: ${response.status}`)
			return body.body as DeploymentListResponse[]
		} catch (err: any) {
			throw new Error(`Failed to remove deployment: ${err.message}`)
		}
	}

	async getStatus(notTemplateName: string[]): Promise<DeploymentListResponse[]> {
		try {
			const queryParams = notTemplateName.map((name) => `not_template_name=${encodeURIComponent(name)}`).join('&')
			const response = await this.tecControllerClient.get(`/deployment/list?${queryParams}&project_id=${this.projectId}`) as AxiosResponse
			const body = response.data as EdgeCloudResponse
			if (body.status !== 'success') throw new Error(`API responded with status: ${response.status}`)
			return body.body as DeploymentListResponse[]
		} catch (err: any) {
			throw new Error(`Failed to get deployment status: ${err.message}`)
		}
	}

	// --- Deployment Templates ---
	async listStandard(category: string): Promise<DeploymentTemplateResponse[]> {
		try {
			const response = await this.tecControllerClient.get(`/deployment_template/list_standard_templates?category=${category}`) as AxiosResponse
			if (response.status !== 200) throw new Error(`API responded with status: ${response.status}`)
			const body = response.data as EdgeCloudResponse
			if (body.status !== 'success') throw new Error(`API responded with status: ${response.status}`)
			return body.body as DeploymentTemplateResponse[]
		} catch (err: any) {
			throw new Error(`Failed to list standard templates: ${err.message}`)
		}
	}

	async listCustom(projectId: string): Promise<DeploymentTemplateResponse[]> {
		try {
			const response = await this.tecControllerClient.get(`/deployment_template/list_custom_templates?project_id=${projectId}`) as AxiosResponse
			const body = response.data as EdgeCloudResponse
			if (body.status !== 'success') throw new Error(`API responded with status: ${response.status}`)
			return body.body as DeploymentTemplateResponse[]			
		} catch (err: any) {
			throw new Error(`Failed to list custom templates: ${err.message}`)
		}	
	}
}
