# Filename: websocket_server/Dockerfile

# ---- Base Stage ----
# Start with a slim, secure Node.js image
FROM node:18-slim AS base
RUN apt-get update && apt-get install -y openssl
WORKDIR /websocket_server
# Install pnpm for workspace support
RUN npm install -g pnpm


# ---- Builder Stage ----
# This stage installs all dependencies (including dev dependencies) and builds the code
FROM base AS builder
# Copy the root package manager configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Copy the source code for ALL shared packages and the websocket_server app
COPY ./packages ./packages
COPY ./websocket_server ./websocket_server
# Install ONLY the dependencies needed for the server and its shared packages
RUN pnpm install --filter websocket_server
# Generate Prisma client explicitly before building
WORKDIR /packages/db
# This tells pnpm to run the "prisma:generate" script defined in the @repo/db package
RUN pnpm --filter @repo/db build
# Go back to app root and build
WORKDIR /websocket_server
# Run the build command for the server, which also builds its dependencies (@repo/db)
RUN pnpm --filter websocket_server build
# Use pnpm's 'deploy' command to create a pruned production-ready folder
# This copies only the necessary production files to a clean '/prod' directory
RUN pnpm --filter websocket_server deploy /prod


# ---- Production Stage ----
# This final stage creates the lean image that will be deployed
FROM base AS runner
ENV NODE_ENV production
# Copy the clean, production-ready files from the builder stage
COPY --from=builder /prod .
# Set the command to start the server by directly running the compiled JS file
CMD ["node", "dist/server.js"]