import { DeploymentManager } from './DeploymentManager'

// Usage example
async function stop() {
	const manager = new DeploymentManager()

	try {
		await manager.initialize()

		try {
			const deployment = await manager.cleanup()
		} catch (err: any) {
			throw new Error(`Deployment error: ${err.message}`)
		}
	} catch (error) {
		console.error('Error:', error)
	}
}

stop()
