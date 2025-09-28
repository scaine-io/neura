import { DeploymentManager } from './DeploymentManager'

async function start(model = 'kokoro') {
	const manager = new DeploymentManager()

	try {
		await manager.initialize()

		try {
			const deployment = await manager.deploy(model)
		} catch (err: any) {
			throw new Error(`Deployment error: ${err.message}`)
		}

		const pollInterval = setTimeout(async () => {
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
				clearTimeout(pollInterval)
				return
			}
		}, 3000)

		// Optional: Set a maximum timeout to avoid infinite polling
		setTimeout(() => {
			clearInterval(pollInterval)
			console.log('Polling timeout reached')
		}, 300000) // Stop after 5 minutes max
	} catch (error) {
		console.error('Error:', error)
	}
}

/* Call the start function with desired model */
start('kokoro')
