export interface DeploymentListResponse {
	ID: number
	CreatedAt: string
	UpdatedAt: string
	DeletedAt: null
	UserID: string
	ProjectID: string
	Shard: number
	Name: string
	TemplateName: string
	MachineType: string
	Suffix: string
	Framework: string
	ImageURL: string
	ContainerPort: number
	ContainerArgsString: string
	EnvVarsString: string
	EnvVars: null
	ContainerArgs: null
	CPURequest: string
	CPULimit: string
	MemRequest: string
	MemLimit: string
	StorageRequest: string
	StorageLimit: string
	GPURequest: string
	GPULimit: string
	GPUModel: string
	Replicas: number
	PodPhase: string
	Annotations: Annotations
	AdditionalPorts: null
	PortMappings: null
	AdditionalLabels: AdditionalLabels
	AuthUsername: string
	AuthPassword: string
	VolumesString: string
	Volumes: null
	SelectedRegion: string
	PriceHr: string
	Cluster: string
	NodeIndex: number
	BaseID: string
	Endpoint: string
	EndpointStatus: number
	NodePublicIP: string
	Region: string
	GPUMemory: string
}

interface AdditionalLabels {
	org: string
}

interface Annotations {
	nickname: string
	tags: string
}
