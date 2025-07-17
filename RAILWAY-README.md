# Railway Deployment for Analytical Testing Laboratory

This repository includes everything you need to deploy your Analytical Testing Laboratory application to Railway, a modern cloud platform that makes deploying Docker applications simple.

## What's Included

1. **Dockerfile** - A multi-stage Docker build optimized for production
2. **docker-compose.yml** - For local development with PostgreSQL
3. **railway.toml** - Railway configuration file
4. **GitHub Actions Workflow** - Automated deployment to Railway
5. **Deployment Scripts** - For both Windows and Unix-based systems

## Quick Start

### Local Development with Docker

```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

Access your application at http://localhost:3000

### Deploy to Railway

#### Option 1: Using the Deployment Scripts

For Unix-based systems (Linux/macOS):
```bash
# Make the script executable
chmod +x deploy-to-railway.sh

# Run the deployment script
./deploy-to-railway.sh
```

For Windows:
```bash
# Run the deployment script
deploy-to-railway.bat
```

#### Option 2: Manual Deployment

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Link your project:
   ```bash
   railway init
   ```

4. Add PostgreSQL:
   ```bash
   railway add
   ```
   (Select PostgreSQL when prompted)

5. Set environment variables:
   ```bash
   railway variables set NODE_ENV=production
   railway variables set PORT=5000
   railway variables set JWT_SECRET=your-secure-jwt-secret
   railway variables set ADMIN_EMAIL=admin@yourdomain.com
   railway variables set ADMIN_PASSWORD=secure-admin-password
   ```

6. Deploy:
   ```bash
   railway up
   ```

7. Generate a public URL:
   ```bash
   railway domain
   ```

#### Option 3: GitHub Actions Automated Deployment

1. Fork this repository
2. Go to your repository settings > Secrets and variables > Actions
3. Add a new repository secret:
   - Name: `RAILWAY_TOKEN`
   - Value: Your Railway API token (get it from Railway CLI with `railway login`)
4. Push to the main branch to trigger deployment

## Environment Variables

The following environment variables are required for deployment:

| Variable | Description |
|----------|-------------|
| NODE_ENV | Set to "production" for deployment |
| PORT | The port your application will run on (5000) |
| DATABASE_URL | PostgreSQL connection string (provided by Railway) |
| JWT_SECRET | Secret key for JWT authentication |
| ADMIN_EMAIL | Email for the admin account |
| ADMIN_PASSWORD | Password for the admin account |

## Documentation

For more detailed information, refer to:

- [RAILWAY-DEPLOYMENT-GUIDE.md](./RAILWAY-DEPLOYMENT-GUIDE.md) - Comprehensive guide for Railway deployment
- [DOCKER-DEPLOYMENT.md](./DOCKER-DEPLOYMENT.md) - General Docker deployment information
- [Dockerfile](./Dockerfile) - Docker build configuration
- [docker-compose.yml](./docker-compose.yml) - Local development setup
- [railway.toml](./railway.toml) - Railway configuration

## Troubleshooting

If you encounter issues during deployment:

1. Check the Railway logs:
   ```bash
   railway logs
   ```

2. Verify your environment variables:
   ```bash
   railway variables
   ```

3. Ensure your database is properly provisioned:
   ```bash
   railway status
   ```

4. Check the application health endpoint:
   ```bash
   curl https://your-railway-domain.up.railway.app/api/health
   ```

## Support

If you need additional help, refer to:

- [Railway Documentation](https://docs.railway.app)
- [Docker Documentation](https://docs.docker.com)
- [Node.js Documentation](https://nodejs.org/en/docs/)
