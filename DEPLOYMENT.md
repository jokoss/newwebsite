# Deployment Guide for Analytical Testing Lab

## Netlify Deployment Setup

This application has been configured to deploy on Netlify using Netlify Functions for the backend API.

### Prerequisites

1. **Database**: You'll need a PostgreSQL database for production. Recommended providers:
   - [Supabase](https://supabase.com/) (Free tier available)
   - [PlanetScale](https://planetscale.com/) (Free tier available)
   - [Neon](https://neon.tech/) (Free tier available)
   - [Railway](https://railway.app/) (PostgreSQL addon)

2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)

### Deployment Steps

#### 1. Database Setup
- Create a PostgreSQL database with your chosen provider
- Note down the `DATABASE_URL` connection string

#### 2. Netlify Configuration
1. Connect your GitHub repository to Netlify
2. Set the following build settings:
   - **Build command**: `cd client && npm install && npm run build`
   - **Publish directory**: `client/build`
   - **Functions directory**: `netlify/functions`

#### 3. Environment Variables
Set these environment variables in Netlify Dashboard → Site Settings → Environment Variables:

```
DATABASE_URL=your_postgresql_connection_string
NODE_ENV=production
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_secure_admin_password
```

#### 4. Domain Configuration (Optional)
- Configure your custom domain in Netlify Dashboard → Domain Settings
- Update CORS origins in the Netlify Function if needed

### Important Notes

#### File Uploads
- The current setup uses memory storage for file uploads in production
- Files are processed immediately but not persisted
- **Recommendation**: Implement cloud storage (Cloudinary, AWS S3) for production file handling

#### Database Migrations
- Database tables will be created automatically on first deployment
- The app uses Sequelize ORM with auto-sync enabled
- For production, consider running migrations manually

#### Performance Considerations
- Netlify Functions have a 10-second timeout limit
- Database connections are established on each function invocation
- Consider implementing connection pooling for high-traffic applications

### Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up local environment variables in `server/.env`
4. Run development server: `npm run dev`

### Troubleshooting

#### Common Issues:

1. **Function Timeout**: Increase timeout in `client/src/utils/api.js` if needed
2. **Database Connection**: Ensure `DATABASE_URL` is correctly formatted
3. **CORS Issues**: Update allowed origins in `netlify/functions/server.js`
4. **Build Failures**: Check Node.js version compatibility (requires Node 18+)

#### Logs and Debugging:
- Check Netlify Function logs in Dashboard → Functions
- Monitor build logs in Dashboard → Deploys
- Use Netlify CLI for local function testing: `netlify dev`

### Security Recommendations

1. Use strong, unique passwords for admin accounts
2. Implement rate limiting for API endpoints
3. Enable HTTPS (automatic with Netlify)
4. Regularly update dependencies
5. Monitor function usage and costs

### Scaling Considerations

For high-traffic applications, consider:
- Implementing Redis for session management
- Using a CDN for static assets
- Database connection pooling
- Caching strategies for frequently accessed data

## Alternative Deployment Options

If Netlify Functions don't meet your needs, consider:
- **Vercel**: Similar serverless approach
- **Railway**: Full-stack deployment with persistent storage
- **Heroku**: Traditional PaaS deployment
- **DigitalOcean App Platform**: Container-based deployment
