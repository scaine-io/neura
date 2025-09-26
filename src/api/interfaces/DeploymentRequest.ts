/**
 * Deployment Request Parameters for Theta EdgeCloud API
 */
export interface DeploymentRequest {
	/** The project in which you want to create your deployment */
	project_id: string

	/** Template for the deployment */
	deployment_template_id: string // Fixed: was deployment_image_id

	/** Machine type id */
	vm_id: string

	/** Min number of replicas */
	min_replicas: number

	/** The name of the deployment */
	name: string

	/** Price per hour is required for community nodes */
	price_hr: string

	shard?: string

	/**
	 * If the deployment template's container_images property has more than one value,
	 * specify which container image to use here
	 */
	container_image?: string

	/** Max number of replicas */
	max_replicas?: number

	/** String to string mapping to add to container environment variables */
	env_vars?: Envvars

	/**
	 * String to string mapping as annotations. You can put an easy to remember nickname
	 * for the deployment, e.g. annotations: {"nickname": "my-notebook"}
	 */
	annotations?: Annotations

	/** Username of http basic auth of the inference endpoint (optional) */
	auth_username?: string

	/** Password of http basic auth of the inference endpoint (optional) */
	auth_password?: string

	/** Username for private container image credentials */
	registry_username?: string

	/** Password for private container image credentials (kept in secure secret manager) */
	registry_password?: string

	/** The password required to set up for the Jupyter instance only */
	password?: string
}

interface Envvars {
	HUGGING_FACE_HUB_TOKEN?: string
	[key: string]: string | undefined
}

interface Annotations {
	nickname?: string
	tags?: string
	[key: string]: string | undefined
}
