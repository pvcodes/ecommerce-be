FROM node:18 AS development

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code
COPY . ./

# Expose the application port
EXPOSE 3000

# Set environment to development
ENV NODE_ENV=development

# Start the application
CMD ["npm", "run", "start:dev"]

# Production Stage
FROM node:18 AS production

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy application code
COPY . ./

# Expose the application port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
