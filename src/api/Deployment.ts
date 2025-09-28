import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { DeploymentListResponse } from './interfaces/DeploymentListResponse'
import { DeploymentRequest } from './interfaces/DeploymentRequest'
import { DeploymentTemplateResponse } from './interfaces/DeploymentTemplateResponse'
import { EdgeCloudResponse } from './interfaces/EdgeCloudResponse'
import { DeploymentTagResponse } from './interfaces/DeploymentTagResponse'
import { CommunityListResponse } from './interfaces/CommunityListResponse'

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
		try {
			const response = (await this.tecControllerClient.post('/deployment', data)) as AxiosResponse
			const body = response.data as EdgeCloudResponse

			if (body.status !== 'success') throw new Error(`API responded with status: ${response.status}`)

			return body.body as unknown as DeploymentListResponse
		} catch (err: any) {
			throw new Error(`Failed to create deployment: ${err.response?.data.message || err.message}`)
		}
	}

	/**
	 * List deployments excluding specified template names. Or get status of the deployment.
	 * @param notTemplateName Array of template names to exclude from the list (default: ['Jupyter Notebook', 'GPU Node'])
	 * @returns
	 */
	async list(notTemplateName: string[] = ['Jupyter Notebook', 'GPU Node']): Promise<DeploymentListResponse[]> {
		try {
			const queryParams = notTemplateName.map((name) => `not_template_name=${encodeURIComponent(name)}`).join('&')
			const response = (await this.tecControllerClient.get(
				`/deployment/list?${queryParams}&project_id=${this.projectId}`
			)) as AxiosResponse
			const body = response.data as EdgeCloudResponse

			if (body.status !== 'success') throw new Error(`API responded with status: ${response.status}`)

			return body.body as DeploymentListResponse[]
		} catch (err: any) {
			throw new Error(`Failed to list deployments: ${err.response?.data.message || err.message}`)
		}
	}

	async stop(shard: string, suffix: string): Promise<DeploymentListResponse[]> {
		try {
			const response = (await this.tecControllerClient.put(
				`/deployment/${shard}/${suffix}/stop?project_id=${this.projectId}`
			)) as AxiosResponse
			const body = response.data as EdgeCloudResponse

			if (body.status !== 'success') throw new Error(`API responded with status: ${response.status}`)
			return body.body as DeploymentListResponse[]
		} catch (err: any) {
			throw new Error(`Failed to stop deployment: ${err.response?.data.message || err.message}`)
		}
	}

	async remove(shard: string, suffix: string): Promise<DeploymentListResponse[]> {
		try {
			const response = (await this.tecControllerClient.delete(
				`/deployment/${shard}/${suffix}?project_id=${this.projectId}`
			)) as AxiosResponse
			const body = response.data as EdgeCloudResponse

			if (body.status !== 'success') throw new Error(`API responded with status: ${response.status}`)
			return body.body as DeploymentListResponse[]
		} catch (err: any) {
			throw new Error(`Failed to remove deployment: ${err.response?.data.message || err.message}`)
		}
	}

	// https://controller.thetaedgecloud.com/community/nodes?projectId=prj_&env=prod
	async listCommunityNodes(projectId: string): Promise<CommunityListResponse[]> {
		try {
			const response = (await this.tecControllerClient.get(`/community/nodes?projectId=${projectId}&env=prod`)) as AxiosResponse
			const body = response.data as EdgeCloudResponse

			if (body.status !== 'success') throw new Error(`API responded with status: ${response.status}`)

			return body.body as CommunityListResponse[]
		} catch (err: any) {
			throw new Error(`Failed to list community nodes: ${err.response?.data.message || err.message}`)
		}
	}

	// --- Deployment Templates ---

	// https://controller.thetaedgecloud.com/deployment_template/standard_template_tags
	async listStandardTags(): Promise<DeploymentTagResponse[]> {
		try {
			const response = (await this.tecControllerClient.get('/deployment_template/standard_template_tags')) as AxiosResponse
			if (response.status !== 200) throw new Error(`API responded with status: ${response.status}`)
			const body = response.data as EdgeCloudResponse
			if (body.status !== 'success') throw new Error(`API responded with status: ${response.status}`)
			return body.body as DeploymentTagResponse[]
		} catch (err: any) {
			throw new Error(`Failed to list standard template tags: ${err.response?.data.message || err.message}`)
		}
	}

	// https://controller.thetaedgecloud.com/deployment_template/standard_templates?tags=TextToSpeech&search=&page=0&number=9&category=serving&hidden=false
	async listStandard(category: string): Promise<DeploymentTemplateResponse> {
		try {
			const response = (await this.tecControllerClient.get(
				`/deployment_template/list_standard_templates?category=${category}`
			)) as AxiosResponse

			if (response.status !== 200) throw new Error(`API responded with status: ${response.status}`)
			const body = response.data as EdgeCloudResponse
			if (body.status !== 'success') throw new Error(`API responded with status: ${response.status}`)
			return body.body as DeploymentTemplateResponse
		} catch (err: any) {
			throw new Error(`Failed to list standard templates: ${err.response?.data.message || err.message}`)
		}
	}

	async listCustom(projectId: string): Promise<DeploymentTemplateResponse[]> {
		try {
			const response = (await this.tecControllerClient.get(
				`/deployment_template/list_custom_templates?project_id=${projectId}`
			)) as AxiosResponse
			const body = response.data as EdgeCloudResponse
			if (body.status !== 'success') throw new Error(`API responded with status: ${response.status}`)
			return body.body as DeploymentTemplateResponse[]
		} catch (err: any) {
			throw new Error(`Failed to list custom templates: ${err.response?.data.message || err.message}`)
		}
	}
}
