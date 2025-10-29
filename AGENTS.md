# Repository Guidelines

## Project Structure & Module Organization
The project splits into `client/` (React + Vite UI) and `server/` (Express API). UI state lives in `client/src/app`, pages in `client/src/pages`, shared widgets in `client/src/components`, and helpers in `client/src/utils`. Backend routing pairs `server/routes` with `server/controllers`, persistence sits in `server/models`, and shared config rests in `server/configs` (database, OpenAI, ImageKit, multer). Copy the environment templates in `client/.env` and `server/.env.example` before running services.

## Build, Test, and Development Commands
- `cd client && npm install`: install UI dependencies.
- `npm run dev`: start the Vite dev server on port 5173 with hot reload.
- `npm run build`: emit static assets to `client/dist` for deployment.
- `npm run lint`: run ESLint with the shared React config.
- `cd server && npm install`: pull backend dependencies.
- `npm run server`: run Express with nodemon on port 3000.
- `npm start`: launch the production server.
- `docker-compose up --build`: start the full stack via Docker (Mongo, server, client).

## Coding Style & Naming Conventions
Keep two-space indentation and single quotes in JavaScript files. React components stay PascalCase, hooks in `client/src/hooks` follow the `useThing` pattern, and Redux slices in `client/src/app` expose camelCase actions. Backend modules stay lowercase (e.g., `users.controller.js`) with camelCase exports, while Mongoose models remain PascalCase. Run `npm run lint` before each PR; the rules only excuse unused SCREAMING_CASE constants.

## Testing Guidelines
No automated test suite exists yet. Until Vitest (or similar) is introduced, validate changes manually through `npm run dev` + `npm run server` and confirm lint passes. If you add tests, colocate them beside the feature (e.g., `component.test.jsx`) and document the execution command in your PR.

## Commit & Pull Request Guidelines
Follow the Conventional Commit style used in history (`feat:`, `fix(scope):`, `chore:`). Keep subjects under 72 characters and describe the behavior change, not the implementation. For PRs, include: overview, testing notes (commands and outcomes), affected screenshots for UI changes, and links to Jira/GitHub issues. Ensure branches stay focused; merge conflicts against `main` should be resolved before requesting review.

## Security & Configuration Tips
Never commit real secrets; copy `server/.env.example` and fill `MONGODB_URI`, `JWT_SECRET`, and OpenAI keys locally. The client expects `VITE_BASE_URL` to resolve to the backend (`http://localhost:3000` by default). Rotate ImageKit or OpenAI credentials regularly and keep deployment keys in secret managers.
