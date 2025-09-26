export interface ResourceLoginResponse {
	users: User[]
}

interface User {
	id: string
	first_name: string
	last_name: null
	language: string
	create_time: string
	update_time: string
	email: string
	email_verified: boolean
	auth_token: string
	email_2fa_enabled: boolean
	otp_2fa_enabled: boolean
	otp_verified: boolean
	opt_out_emails: boolean
	opt_out_texts: boolean
}
