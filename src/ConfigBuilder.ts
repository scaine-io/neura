export function BuildConfig() {
	const key = process.env.EDGECLOUD_API_KEY
	const projectId = process.env.EDGECLOUD_PROJECT_ID
	const userId = process.env.EDGECLOUD_USER_ID
	const email = process.env.EDGECLOUD_USER_EMAIL
	const password = process.env.EDGECLOUD_USER_PASSWORD

	if (!key) throw new Error('EDGECLOUD_API_KEY is not set in environment variables')
	if (!projectId) throw new Error('EDGECLOUD_PROJECT_ID is not set in environment variables')
	if (!userId) throw new Error('EDGECLOUD_USER_ID is not set in environment variables')
	if (!email) throw new Error('EDGECLOUD_USER_EMAIL is not set in environment variables')
	if (!password) throw new Error('EDGECLOUD_USER_PASSWORD is not set in environment variables')
	return { key, email, password, projectId, userId }
}
