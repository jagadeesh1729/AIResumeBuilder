Deployment (Docker + MongoDB)

Overview
- Builds production images for client (Nginx) and server (Node.js)
- Runs MongoDB in a container with a persistent volume
- Proxies client requests from Nginx to the API at /api

Prerequisites
- Docker and Docker Compose installed

1) Configure environment
- Copy `resume-builder/server/.env.example` to `resume-builder/server/.env` and set values:
  - `JWT_SECRET` (required)
  - `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL` (if using AI features)
  - `IMAGEKIT_PRIVATE_KEY` (if using ImageKit)
  - `MONGODB_URI` is provided via docker-compose (`mongodb://mongo:27017`); leave as-is or override.

2) Build and run
```
docker compose -f resume-builder/docker-compose.yml up -d --build
```

3) Access the app
- Client: http://localhost:8080
- API: http://localhost:8080/api

Notes
- Client build uses `VITE_BASE_URL=/api` so Axios targets the Nginx proxy.
- MongoDB data persists in the `mongo_data` Docker volume.
- To view logs: `docker compose -f resume-builder/docker-compose.yml logs -f server`
- To rebuild after changes: `docker compose -f resume-builder/docker-compose.yml up -d --build`

