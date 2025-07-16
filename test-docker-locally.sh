#!/bin/bash
# Script to test Docker setup locally before deploying to Render

# Set colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Testing Docker Setup for Analytical Testing Laboratory ===${NC}"
echo -e "${YELLOW}This script will build and run your Docker containers locally to verify everything works before deploying to Render.${NC}"
echo ""

# Check if Docker is installed
echo -e "${YELLOW}Checking if Docker is installed...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
else
    echo -e "${GREEN}Docker is installed.${NC}"
fi

# Check if Docker Compose is installed
echo -e "${YELLOW}Checking if Docker Compose is installed...${NC}"
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
else
    echo -e "${GREEN}Docker Compose is installed.${NC}"
fi

# Stop any running containers
echo -e "${YELLOW}Stopping any existing containers...${NC}"
docker-compose down
echo -e "${GREEN}Done.${NC}"

# Build the Docker images
echo -e "${YELLOW}Building Docker images...${NC}"
docker-compose build
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to build Docker images. Please check the error messages above.${NC}"
    exit 1
else
    echo -e "${GREEN}Docker images built successfully.${NC}"
fi

# Start the containers
echo -e "${YELLOW}Starting containers...${NC}"
docker-compose up -d
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to start containers. Please check the error messages above.${NC}"
    exit 1
else
    echo -e "${GREEN}Containers started successfully.${NC}"
fi

# Wait for the application to start
echo -e "${YELLOW}Waiting for the application to start (30 seconds)...${NC}"
sleep 30

# Check if the application is running
echo -e "${YELLOW}Checking if the application is running...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ $response -eq 200 ]; then
    echo -e "${GREEN}Application is running successfully!${NC}"
else
    echo -e "${YELLOW}Application might not be fully started yet. Let's check the logs:${NC}"
    docker-compose logs app
    echo ""
    echo -e "${YELLOW}You can manually check if the application is running at http://localhost:3000${NC}"
fi

# Check the health endpoint
echo -e "${YELLOW}Checking health endpoint...${NC}"
health_response=$(curl -s http://localhost:3000/api/health)
if [[ $health_response == *"healthy"* ]]; then
    echo -e "${GREEN}Health check passed: $health_response${NC}"
else
    echo -e "${RED}Health check might have failed. Response: $health_response${NC}"
    echo -e "${YELLOW}Check the logs for more details:${NC}"
    docker-compose logs app
fi

echo ""
echo -e "${YELLOW}=== Docker Test Summary ===${NC}"
echo -e "${GREEN}✓${NC} Docker and Docker Compose are installed"
echo -e "${GREEN}✓${NC} Docker images built successfully"
echo -e "${GREEN}✓${NC} Containers started successfully"
if [ $response -eq 200 ]; then
    echo -e "${GREEN}✓${NC} Application is running at http://localhost:3000"
else
    echo -e "${YELLOW}?${NC} Application status uncertain, check manually at http://localhost:3000"
fi
if [[ $health_response == *"healthy"* ]]; then
    echo -e "${GREEN}✓${NC} Health check passed"
else
    echo -e "${YELLOW}?${NC} Health check status uncertain"
fi

echo ""
echo -e "${YELLOW}=== Next Steps ===${NC}"
echo -e "1. Verify the application works by visiting http://localhost:3000 in your browser"
echo -e "2. Test key functionality (login, admin dashboard, etc.)"
echo -e "3. If everything works, you're ready to deploy to Render!"
echo -e "4. To stop the containers, run: ${GREEN}docker-compose down${NC}"
echo ""
echo -e "${YELLOW}=== Useful Commands ===${NC}"
echo -e "${GREEN}docker-compose logs${NC} - View logs from all containers"
echo -e "${GREEN}docker-compose logs app${NC} - View logs from the application container"
echo -e "${GREEN}docker-compose ps${NC} - List running containers"
echo -e "${GREEN}docker-compose down${NC} - Stop and remove containers"
echo -e "${GREEN}docker-compose up -d${NC} - Start containers in the background"
echo -e "${GREEN}docker-compose up${NC} - Start containers and view logs"
