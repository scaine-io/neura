import { CommunityListResponse } from './CommunityListResponse'
import { DeploymentListResponse } from './DeploymentListResponse'
import { DeploymentTagResponse } from './DeploymentTagResponse'
import { DeploymentTemplateResponse } from './DeploymentTemplateResponse'
import { ResourceListResponse } from './ResourceListReponse'
import { ResourceLoginResponse } from './ResourceLoginResponse'

export interface EdgeCloudResponse {
	status: string
	body:
		| DeploymentTemplateResponse[]
		| DeploymentListResponse[]
		| ResourceLoginResponse
		| DeploymentTemplateResponse
		| DeploymentListResponse[]
		| DeploymentTagResponse[]
		| CommunityListResponse[]
		| ResourceListResponse
}
