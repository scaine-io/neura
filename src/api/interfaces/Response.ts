import { DeploymentListResponse } from './DeploymentListResponse'
import { DeploymentTemplateResponse } from './DeploymentTemplateResponse'
import { ResourceLoginResponse } from './ResourceLoginResponse'

export interface EdgeCloudResponse {
	status: string
	body: DeploymentTemplateResponse[] | DeploymentListResponse[] | ResourceLoginResponse | DeploymentTemplateResponse []
}
