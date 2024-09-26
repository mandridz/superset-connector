# Stage 1: Install Dependencies
FROM node:20-buster AS dep
WORKDIR /app

# Set NODE_ENV to development to install devDependencies
ENV NODE_ENV=development

# Copy root package.json and package-lock.json
COPY package.json package-lock.json ./

# Copy package.json of the workspace project
COPY superset-connector/package.json superset-connector/

# Install dependencies using npm workspaces
RUN npm install

# Stage 2: Build the Application
FROM node:20-buster AS builder
WORKDIR /app

# Copy the entire repository
COPY . .

# Copy node_modules from the dep stage
COPY --from=dep /app/node_modules ./node_modules

# Define build argument for specifying the project path
ARG path=superset-connector

# Change working directory to the specified project
WORKDIR /app/${path}

# Add node_modules/.bin to PATH
ENV PATH=/app/node_modules/.bin:$PATH

# Run the build script for the specific project
RUN npm run build

# Stage 3: Prepare the Production Image
FROM node:20-buster AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create a non-root user and group for security
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Copy package.json of the workspace project for production dependencies
COPY superset-connector/package.json superset-connector/

# Change working directory to the workspace directory
WORKDIR /app/superset-connector

# Install only production dependencies for the workspace
RUN npm install --production

# Return to /app directory
WORKDIR /app

# Define build argument again for the runner stage
ARG path=superset-connector

# Copy the built dist folder from the builder stage
COPY --from=builder /app/${path}/dist ./dist

# Set appropriate permissions
RUN chown -R appuser:appgroup ./dist

# Switch to the non-root user
USER appuser

# Expose the application port
EXPOSE 3000

# Define the command to run the application
CMD ["node", "dist/main"]
