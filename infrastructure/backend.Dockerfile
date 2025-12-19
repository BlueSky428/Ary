FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY ../shared ./shared

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 3001

# Start server
CMD ["npm", "start"]

