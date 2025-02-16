# Base image for Python backend
FROM python:3.9 AS backend

WORKDIR /app
COPY backend/ backend/
COPY requirements.txt .
RUN pip install -r requirements.txt

# Base image for React frontend
FROM node:18 AS frontend

WORKDIR /app
COPY frontend/ frontend/
RUN cd frontend && npm install && npm run build

# Final container image
FROM python:3.9

WORKDIR /app
COPY --from=backend /app/backend backend/
COPY --from=frontend /app/frontend/build backend/static/
COPY requirements.txt .
RUN pip install -r requirements.txt

CMD ["python", "backend/app.py"]
