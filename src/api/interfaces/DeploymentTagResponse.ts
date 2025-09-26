export interface DeploymentTagResponse {
	tag: 'TextToSpeech' | 'VideoGen'
	count: string
	container_images: any[]
}
