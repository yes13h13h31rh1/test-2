# ML Service Dockerfile for Render.com
FROM python:3.11-slim

WORKDIR /app

# Copy requirements
COPY ml-service/requirements.txt ./

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy source files
COPY ml-service/ ./ml-service

WORKDIR /app/ml-service

# Create assets directory
RUN mkdir -p generated_assets

# Expose port
EXPOSE 10000

# Start server
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]
