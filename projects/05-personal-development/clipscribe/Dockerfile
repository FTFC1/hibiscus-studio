# Step 1: Build the React application
FROM node:20-slim as build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve the built application
FROM node:20-slim
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm install -g serve
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]
