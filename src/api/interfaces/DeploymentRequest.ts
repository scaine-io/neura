export interface DeploymentRequest {
	name: string
	project_id: string
	deployment_image_id: string
	container_image: string
	min_replicas: number
	max_replicas: number
	vm_id: string
	annotations: Annotations
	auth_username: string
	auth_password: string
	price_hr: string
	env_vars?: Envvars
	shard?: string
}

interface Envvars {
	HUGGING_FACE_HUB_TOKEN: string
}

interface Annotations {
	tags: string
	nickname: string
}
