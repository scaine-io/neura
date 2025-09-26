import 'dotenv/config'
import { Deployment } from './api/Deployment'
import { Resource } from './api/Resource'
import { DeploymentRequest } from './api/interfaces/DeploymentRequest'

// Example: List nodes
async function main() {
	try {
		const key = process.env.EDGECLOUD_API_KEY
		const projectId = process.env.EDGECLOUD_PROJECT_ID
		const userId = process.env.EDGECLOUD_USER_ID
		const email = process.env.EDGECLOUD_USER_EMAIL
		const password = process.env.EDGECLOUD_USER_PASSWORD

		if (!key) throw new Error('EDGECLOUD_API_KEY is not set in environment variables')
		if (!projectId) throw new Error('EDGECLOUD_PROJECT_ID is not set in environment variables')
		if (!userId) throw new Error('EDGECLOUD_USER_ID is not set in environment variables')
		if (!email) throw new Error('EDGECLOUD_USER_EMAIL is not set in environment variables')
		if (!password) throw new Error('EDGECLOUD_USER_PASSWORD is not set in environment variables')

		const resource = new Resource(key)
		const loginResponse = await resource.login(email, password)
		// console.log('Login Response:', loginResponse.body)
		const token = loginResponse.users[0].auth_token

		const deployment = new Deployment(token, projectId, userId)

		const deployments = await deployment.list(['Jupyter Notebook', 'GPU Node'])
		console.log('Deployments:', deployments)

		const standardTemplates = await deployment.listStandard('serving', ['TextToSpeech'])
		// console.log('Standard Templates:', standardTemplates)

		// sort on newest first
		const templates = standardTemplates.templates.sort((a, b) => {
			const aTime = Date.parse(a.create_time)
			const bTime = Date.parse(b.create_time)
			return bTime - aTime
		})

		// filter on name is kokoro
		const deploymentTemplate = templates.filter((d) => d.name.toLowerCase().includes('kokoro'))[0]
		console.log('Deployments:', JSON.stringify(deploymentTemplate))

		if (!deploymentTemplate) {
			throw new Error('No deployment template found with name kokoro')
		}

		// // get VMs
		// const vmResponse = await resource.listVMs()
		// // console.log('VMs:', vmResponse)

		// // find suggested VM
		// const suggestedVm = standardTemplates.templates[0].suggested_vms[0]
		// console.log('Suggested VM:', suggestedVm)

		// // find vm with the suggested id
		// const vm = vmResponse.vms.find((v) => v.id === suggestedVm)
		// console.log('VM:', vm)

		// if (!vm) {
		// 	throw new Error(`No VM found with id ${suggestedVm}`)
		// }

		const communityNodes = await deployment.listCommunityNodes(projectId)
		// console.log('Community Nodes:', communityNodes)

		const minRam = templates[0].min_vram
		const vm = communityNodes
			.filter((node) => Number(node.label_nvidia_com_gpu_memory) >= minRam)
			// sort by lowest price
			?.sort((a, b) => Number(a.label_onthetaedgecloud_com_price_hr) - Number(b.label_onthetaedgecloud_com_price_hr))[0]

		// console.log('Selected VM:', vm)

		if (!vm) {
			throw new Error(`No community node found with at least ${minRam} MB VRAM`)
		}

		const vmId = vm.vm_id

		const createRequest: DeploymentRequest = {
			name: 'kokoro' + Math.random().toString(36).substring(2, 10),
			project_id: projectId,
			deployment_template_id: deploymentTemplate.id,
			min_replicas: 1,
			vm_id: vmId,
			price_hr: vm.label_onthetaedgecloud_com_price_hr.toString(),
		}

		console.log('Create Request:', JSON.stringify(createRequest))

		// const createResponse = await deployment.create(createRequest)
		// console.log('Create Response:', createResponse)

		const shard = deployments[0].Shard
		const suffix = deployments[0].Suffix
		// const stopResponse = await deployment.stop(String(shard), String(suffix))
		// console.log('Stop Response:', stopResponse)

		// const removeResponse = await deployment.remove(String(shard), String(suffix))
		// console.log('Remove Response:', removeResponse)
	} catch (error) {
		console.error('Error fetching nodes:', error)
	}
}

main()
