
export interface DeploymentTemplateResponse {
	total_count: string
	templates: Template[]
	page: number
	number: number
}

interface Template {
	id: string
	name: string
	description: string
	short_description: string
	tags: string[]
	category: string
	project_id: null
	container_images: string[]
	suggested_vms: string[]
	container_port: number
	container_args: string[] | null
	env_vars: Envvar | null
	require_env_vars: boolean
	rank: number
	icon_url: null
	create_time: string
	support_on_demand: boolean
	min_vram: number
	hidden: boolean
}

interface Envvar {
	HUGGING_FACE_HUB_TOKEN: string
}
