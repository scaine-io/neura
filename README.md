# neura

Theta EdgeCloud deployment API (deploy dedicated Theta models)

## Usage

### Start a Deployment

```bash
# Start with default template (kokoro)
npm start
```

### Stop a Deployment

```bash
# Remove the all current deployments
npm run stop
```

## Create EdgeCloud key

https://docs.thetatoken.org/docs/edgecloud-api-keys

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Theta EdgeCloud API Configuration
EDGECLOUD_API_KEY=your_api_key_here
EDGECLOUD_PROJECT_ID=prj_your_project_id
EDGECLOUD_USER_ID=usr_your_user_id

# Login Credentials (for authentication)
EDGECLOUD_EMAIL=your_email@example.com
EDGECLOUD_PASSWORD=your_password

# Optional: Auth Token (if you already have one)
EDGECLOUD_AUTH_TOKEN=your_auth_token_here
```

### How to get these values:

1. **EDGECLOUD_API_KEY**: Get from [EdgeCloud API Keys page](https://docs.thetatoken.org/docs/edgecloud-api-keys)
2. **EDGECLOUD_PROJECT_ID**: Found in your EdgeCloud dashboard URL or project settings
3. **EDGECLOUD_USER_ID**: Your user ID from EdgeCloud account
4. **EDGECLOUD_EMAIL/PASSWORD**: Your EdgeCloud login credentials

### Example .env file:

```env
EDGECLOUD_API_KEY=eck_1234567890abcdef
EDGECLOUD_PROJECT_ID=prj_abc123def456
EDGECLOUD_USER_ID=usr_xyz789uvw012
EDGECLOUD_EMAIL=user@example.com
EDGECLOUD_PASSWORD=mypassword123
```

**Note:** Keep your `.env` file secure and never commit it to version control.
