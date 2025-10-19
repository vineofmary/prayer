# Dockerfile

# Use a specific, lightweight Nginx image as a base for reproducibility
FROM nginx:1.25-alpine

# Set the working directory inside the container
WORKDIR /usr/share/nginx/html

# Copy the custom Nginx configuration file to the container.
# This will overwrite the default Nginx config.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy all your application assets (HTML, CSS, JS, etc.)
# from the local 'assets' folder to the working directory in the container.
COPY app/src/main/assets/ .

# Inform Docker that the container will listen on port 8080 at runtime.
# This is the default port that Google Cloud Run uses.
EXPOSE 8080