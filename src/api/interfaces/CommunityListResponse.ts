export interface CommunityListResponse {
	cluster: string
	cpu_allocate: string
	cpu_capacity: string
	ephemeral_storage_allocate: string
	ephemeral_storage_capacity: string
	gpu_allocate: string
	gpu_capacity: string
	label_nvidia_com_cuda_driver_major: string
	label_nvidia_com_cuda_driver_minor: string
	label_nvidia_com_cuda_runtime_major: string
	label_nvidia_com_cuda_runtime_minor: string
	label_nvidia_com_gpu_count: string
	label_nvidia_com_gpu_memory: string
	label_nvidia_com_gpu_product: string
	label_onthetaedgecloud_com_community: string
	label_onthetaedgecloud_com_download_speed_mbps: string
	label_onthetaedgecloud_com_price_hr: number
	label_onthetaedgecloud_com_shard: string
	label_onthetaedgecloud_com_upload_speed_mbps: string
	memory_allocate: string
	memory_capacity: string
	node: string
	shard: string
	theta_env: string
	vm_id: string
	label_onthetaedgecloud_com_wsl?: string
}
