export interface ResourceListResponse {
	vms: Vm[]
}

interface Vm {
	id: string
	name: string
	description: null | string
	resources: Resources
	price_hour: string
	rank: number
}

interface Resources {
	cpu: string
	mem: string
	storage: string
	gpu?: string
	gpu_model?: string
}
