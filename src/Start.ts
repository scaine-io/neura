import { runTextToSpeech } from '../text-to-speech'
import { DeploymentManager } from './DeploymentManager'

const manager = new DeploymentManager()
async function start(model = 'kokoro') {
	try {
		await manager.initialize()

		try {
			const deployment = await manager.deploy(model)
			process.env.HTTP_ENDPOINT = deployment?.Endpoint
			console.log('Deployment endpoint set in environment:', process.env.HTTP_ENDPOINT)
		} catch (err: any) {
			throw new Error(`Deployment error: ${err.message}`)
		}

		monitor() // Stop after 5 minutes max
	} catch (error) {
		console.error('Error:', error)
	}
}

function monitor() {
	const pollInterval = setInterval(async () => {
		const deployment = manager.getDeployStatus()
		const resolvedDeployment = await deployment

		if (!resolvedDeployment) {
			console.log('Deployment not found')
			return
		}

		const status = resolvedDeployment?.EndpointStatus
		console.log(`Deployment Status: ${status}`)
		// if ok stop timer
		if (status === 200) {
			console.log('Deployment is ready!')
			console.log(`HTTP Endpoint: ${resolvedDeployment.Endpoint}`)
			console.log(`HTTP Endpoint API: ${resolvedDeployment.Endpoint}?view=api`)

			clearTimeout(pollInterval)

			// Start text-to-speech process
			await runTextToSpeech(resolvedDeployment.Endpoint)
			return
		}
	}, 5000)

	// Optional: Set a maximum timeout to avoid infinite polling
	setTimeout(() => {
		clearInterval(pollInterval)
		console.log('Polling timeout reached')
	}, 300000)
}

/* Call the start function with desired model */
start('kokoro')
