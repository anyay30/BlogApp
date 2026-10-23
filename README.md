# SmartBlog

SmartBlog is a full-stack blogging application with a public blog, reader accounts, and an admin dashboard for publishing and managing articles. The admin editor can request an AI-generated first draft from Google Gemini; administrators can edit the result before publishing.

## Features

- Browse and read published blog posts by category.
- Create a reader account, sign in, and sign out.
- Admin sign-in and protected publishing dashboard.
- Create, edit, list, and delete blog posts, with image uploads through ImageKit.
- Review and manage reader comments.
- Generate a blog draft with Gemini. Temporary provider outages are returned as a clear retry message.
- Responsive React interface with Tailwind CSS.

## Project structure

```text
BlogApp/
├── Client/       React + Vite frontend
├── Server/       Express + MongoDB API
└── render.yaml   Render API service configuration
```

The frontend source is in `Client/src`; the Vite environment directory is `Client/client`. The backend starts from `Server/server.js`.

## Requirements

- Node.js 20 or later and npm
- MongoDB connection string
- ImageKit account for blog image uploads
- Google Gemini API key for AI draft generation

## Run locally

Open two terminals from the repository root.

### 1. Configure and start the API

```powershell
cd Server
Copy-Item .env.example .env
npm install
npm run dev
```

Edit `Server/.env` and set the values described below. The API defaults to `http://localhost:5000`.

### 2. Configure and start the frontend

```powershell
cd Client
Copy-Item client/.env.example client/.env
npm ci
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). Set `VITE_API_URL` in `Client/client/.env` to the API base URL, without a trailing slash.

## Environment variables

### Server (`Server/.env`)

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string used to store users, blogs, and comments. |
| `JWT_SECRET` | Long, random secret used to sign admin and reader session tokens. |
| `ADMIN_EMAIL` | Email for the admin dashboard account. |
| `ADMIN_PASSWORD` | Strong password for the admin dashboard account. |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key used by the API and browser upload flow. |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key; keep this only on the server. |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint for uploaded images. |
| `GEMINI_API_KEY` | Google Gemini key for AI blog draft generation. |
| `CLIENT_URL` | Frontend origin allowed by the API CORS configuration, e.g. `http://localhost:5173`. |
| `PORT` | Optional API port; defaults to `5000`. |

### Frontend (`Client/client/.env`)

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Public API base URL used by the frontend, e.g. `http://localhost:5000`. |

Never commit `.env` files or paste private keys into source code. Use the `.env.example` files as templates and configure production secrets in the hosting provider's environment settings.

## Available scripts

Run these from their respective folders:

| Folder | Command | Description |
| --- | --- | --- |
| `Client` | `npm run dev` | Start Vite development server. |
| `Client` | `npm run build` | Create the production frontend in `Client/dist`. |
| `Client` | `npm run lint` | Run ESLint on frontend source. |
| `Client` | `npm run preview` | Preview the production frontend locally. |
| `Server` | `npm start` | Start the Express API. |
| `Server` | `npm run dev` | Start the API with nodemon. |

## API overview

The API is mounted under `/api` and includes routes for blogs, comments, AI draft generation, image upload authentication, admin login, and reader registration/login. The root `GET /` endpoint returns an API status message. Admin publishing and AI generation routes require an admin token; reader accounts use the `/api/auth` registration and login endpoints.

## Deployment

- **API:** `render.yaml` configures a Render Node web service with `Server` as its root directory. Add the server environment variables in Render before deploying.
- **Frontend:** `Client/vercel.json` provides the Vercel SPA rewrite. Set `VITE_API_URL` in the frontend project settings to the deployed API URL, and set `CLIENT_URL` on the API to the deployed frontend origin.
- Deploy the API and frontend separately. Keep database and provider credentials in their respective hosting environment variable settings.

## License

No license has been added yet. Contact the repository owner before redistributing this project.
