import 'dotenv/config'
import { Deployment } from './api/Deployment'
import { Resource } from './api/Resource'

// Example: List nodes
async function main() {
	try {
		const key = process.env.EDGECLOUD_API_KEY
		if (!key) {
			throw new Error('EDGECLOUD_API_KEY is not set in environment variables')
		}

		const projectId = process.env.EDGECLOUD_PROJECT_ID
		if (!projectId) {
			throw new Error('EDGECLOUD_PROJECT_ID is not set in environment variables')
		}

		const userId = process.env.EDGECLOUD_USER_ID
		if (!userId) {
			throw new Error('EDGECLOUD_USER_ID is not set in environment variables')
		}

		const email = process.env.EDGECLOUD_USER_EMAIL
		if (!email) {
			throw new Error('EDGECLOUD_USER_EMAIL is not set in environment variables')
		}

		const password = process.env.EDGECLOUD_USER_PASSWORD
		if (!password) {
			throw new Error('EDGECLOUD_USER_PASSWORD is not set in environment variables')
		}

		const resource = new Resource(key)
		const loginResponse = await resource.login(email, password)
		// console.log('Login Response:', loginResponse.body)
		const token = loginResponse.users[0].auth_token

		const deployment = new Deployment(token, projectId, userId)

		const deployments = await deployment.list(['Jupyter Notebook', 'GPU Node'])
		const standardTemplates = await deployment.listStandard('serving')
		console.log('Standard Templates:', standardTemplates)

		console.log('Deployments:', deployments)
	} catch (error) {
		console.error('Error fetching nodes:', error)
	}
}

main()
