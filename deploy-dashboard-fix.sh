#!/bin/bash

# Deploy dashboard fix to Railway
echo "Deploying dashboard fix to Railway..."

# Add changes to git
git add server/controllers/dashboard.controller.js
git add server/routes/dashboard.admin.routes.js
git add server/routes/admin.routes.js
git add client/src/pages/admin/AdminDashboard.js
git add client/src/utils/api.js

# Commit changes
git commit -m "Fix: Add dashboard API endpoint and update client to fetch data from API"

# Push to Railway
railway up

echo "Deployment complete!"
