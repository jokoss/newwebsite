# Setting Up GitHub Actions for Automatic Deployment to Render

This guide will help you set up GitHub Actions to automatically deploy your application to Render whenever you push changes to your main branch.

## Prerequisites

- Your application code is hosted on GitHub
- You have a Render account with your application deployed
- You have admin access to your GitHub repository

## Step 1: Get Your Render API Key

1. Log in to your Render dashboard at [dashboard.render.com](https://dashboard.render.com)
2. Click on your profile icon in the top right corner
3. Select "Account Settings"
4. Navigate to the "API Keys" tab
5. Click "Create API Key"
6. Give your API key a name (e.g., "GitHub Actions")
7. Copy the generated API key and keep it secure (you'll need it in Step 3)

## Step 2: Get Your Render Service ID

1. In your Render dashboard, go to the web service for your application
2. Look at the URL in your browser's address bar
3. The service ID is the alphanumeric string after `/services/` in the URL
   - For example, if the URL is `https://dashboard.render.com/web/srv-abcdefg`, your service ID is `srv-abcdefg`
4. Copy this service ID (you'll need it in Step 3)

## Step 3: Add Secrets to Your GitHub Repository

1. Go to your GitHub repository
2. Click on "Settings" (near the top right)
3. In the left sidebar, click on "Secrets and variables" then "Actions"
4. Click "New repository secret"
5. Add your Render API key:
   - Name: `RENDER_API_KEY`
   - Value: [paste the API key you copied in Step 1]
   - Click "Add secret"
6. Click "New repository secret" again
7. Add your Render service ID:
   - Name: `RENDER_SERVICE_ID`
   - Value: [paste the service ID you copied in Step 2]
   - Click "Add secret"

## Step 4: Verify the GitHub Actions Workflow File

The GitHub Actions workflow file (`.github/workflows/render-deploy.yml`) has already been created in your repository. It contains the configuration needed to automatically deploy your application to Render.

Make sure the workflow file is configured to trigger on pushes to your main branch:

```yaml
on:
  push:
    branches:
      - main  # or master, depending on your default branch name
```

If your default branch is named something other than `main` (e.g., `master`), update this line accordingly.

## Step 5: Test the Automatic Deployment

1. Make a small change to your code
2. Commit and push the change to your main branch
3. Go to the "Actions" tab in your GitHub repository
4. You should see a workflow run in progress
5. Click on the workflow run to see the details
6. Once the workflow completes successfully, your application will be deployed to Render

## Step 6: Monitor Deployments

You can monitor your deployments in two places:

### GitHub Actions Dashboard

1. Go to the "Actions" tab in your GitHub repository
2. You'll see a list of all workflow runs
3. Click on any run to see detailed logs and status

### Render Dashboard

1. Log in to your Render dashboard
2. Go to your web service
3. Click on the "Deploys" tab
4. You'll see a list of all deployments, including those triggered by GitHub Actions

## Troubleshooting

### Workflow Run Failed

If your workflow run fails, check the logs in the GitHub Actions dashboard for error messages. Common issues include:

- Incorrect API key or service ID
- API key doesn't have sufficient permissions
- Service ID doesn't exist or belongs to a different account

### Deployment Failed

If the workflow run succeeds but the deployment fails, check the deployment logs in the Render dashboard. Common issues include:

- Build errors in your application
- Missing environment variables
- Database connection issues

### API Rate Limits

Render has API rate limits that may affect frequent deployments. If you're hitting rate limits, consider:

- Reducing the frequency of deployments
- Only triggering deployments on specific branches or paths
- Adding conditions to your workflow to only deploy on significant changes

## Advanced Configuration

### Deploying Only on Specific Changes

You can configure the workflow to only trigger when certain files change:

```yaml
on:
  push:
    branches:
      - main
    paths:
      - 'server/**'
      - 'client/**'
      - 'package.json'
      - 'Dockerfile'
```

### Adding Manual Trigger

You can add a manual trigger to deploy on demand:

```yaml
on:
  push:
    branches:
      - main
  workflow_dispatch:  # Allows manual triggering
```

### Adding Deployment Notifications

You can add steps to notify your team about deployments:

```yaml
steps:
  # ... existing steps ...
  
  - name: Send Slack notification
    uses: rtCamp/action-slack-notify@v2
    env:
      SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
      SLACK_TITLE: "Deployment to Render"
      SLACK_MESSAGE: "Application has been deployed to Render"
```

## Conclusion

You've now set up automatic deployments from GitHub to Render using GitHub Actions. This will streamline your development workflow by automatically deploying your changes whenever you push to your main branch.
