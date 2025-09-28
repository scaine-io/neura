import 'dotenv/config'
import { Deployment } from './api/Deployment'
import { Resource } from './api/Resource'
import { DeploymentRequest } from './api/interfaces/DeploymentRequest'
import { DeploymentListResponse } from './api/interfaces/DeploymentListResponse'
import { BuildConfig } from './ConfigBuilder'

export class DeploymentManager {
	private resource: Resource
	private deployment: Deployment | null = null
	private config: ReturnType<typeof BuildConfig>
	private deploymentId: number = 0

	constructor() {
		this.config = BuildConfig()
		this.resource = new Resource(this.config.key)
	}

	async initialize(): Promise<void> {
		try {
			const loginResponse = await this.resource.login(this.config.email, this.config.password)
			const token = loginResponse.users[0].auth_token

			this.deployment = new Deployment(token, this.config.projectId, this.config.userId)
		} catch (error) {
			throw new Error(`Failed to initialize deployment manager: ${error}`)
		}
	}

	async deploy(templateNameFilter: string): Promise<DeploymentListResponse> {
		if (!this.deployment) throw new Error('Deployment manager not initialized. Call initialize() first.')

		try {
			// List current deployments
			const deployments = await this.deployment.list(['Jupyter Notebook', 'GPU Node'])
			console.log(`Active deployments: ${deployments.map((d) => d.Name).join(', ')}`)

			// Get standard templates
			const standardTemplates = await this.deployment.listStandard('serving')

			// Sort by newest first
			const templates = standardTemplates.templates.sort((a, b) => Date.parse(b.create_time) - Date.parse(a.create_time))

			// Filter by template name
			const deploymentTemplate = templates.filter((d) => d.name.toLowerCase().includes(templateNameFilter.toLowerCase()))[0]

			if (!deploymentTemplate) throw new Error(`No deployment template found with name ${templateNameFilter}`)

			console.log('Selected Template:', deploymentTemplate.name)

			// Get community nodes
			const communityNodes = await this.deployment.listCommunityNodes(this.config.projectId)
			const minRam = templates[0].min_vram

			// Find suitable VM
			const vm = communityNodes
				.filter((node) => Number(node.label_nvidia_com_gpu_memory) >= minRam)
				.sort((a, b) => Number(a.label_onthetaedgecloud_com_price_hr) - Number(b.label_onthetaedgecloud_com_price_hr))[0]

			if (!vm) throw new Error(`No community node found with at least ${minRam} MB VRAM`)

			// Create deployment request
			const createRequest: DeploymentRequest = {
				project_id: this.config.projectId,
				deployment_template_id: deploymentTemplate.id,
				min_replicas: 1,
				vm_id: vm.vm_id,
				price_hr: vm.label_onthetaedgecloud_com_price_hr.toString(),
				name: `${templateNameFilter}${Date.now()}`,
			}

			// Create deployment
			const createResponse = await this.deployment.create(createRequest)
			this.deploymentId = createResponse.ID

			console.log(
				`Deployment Created: ${createResponse.Name} | URL: ${createResponse.Endpoint} | Status: ${createResponse.EndpointStatus}`
			)

			return createResponse
		} catch (error) {
			throw new Error(`Deployment failed: ${error}`)
		}
	}

	async getDeployStatus(): Promise<DeploymentListResponse | undefined> {
		try {
			if (this.deploymentId === 0) return undefined
			const deployments = await this.deployment?.list(['Jupyter Notebook', 'GPU Node'])
			return deployments?.find((x) => x.ID === this.deploymentId) as DeploymentListResponse
		} catch (err: any) {
			throw new Error(`Failed to get deployment status: ${err.message}`)
		}
	}

	// todo: this clean all models, add filter to remove only specific model deployment
	async cleanup(): Promise<void> {
		if (!this.deployment) throw new Error('Deployment manager not initialized. Call initialize() first.')

		try {
			const actualDeployment = await this.deployment.list(['Jupyter Notebook', 'GPU Node'])

			if (actualDeployment.length === 0) {
				console.log('No active deployments to remove.')
				return
			}

			// for each deployment remove
			for (const dep of actualDeployment) {
				await this.deployment.remove(String(dep.Shard), String(dep.Suffix))
				console.log(`Removed deployment: ${dep.Name} (ID: ${dep.ID})`)
			}
		} catch (error) {
			throw new Error(`Failed to remove deployment: ${error}`)
		}
	}
}
