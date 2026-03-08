# Use Node.js image
FROM node:20-alpine

# Working directory
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --production

# Copy only required application files
COPY server.js ./
COPY src ./src
COPY openapi.yaml ./openapi.yaml

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]