# Deployment

The React client in `client/` uses the MongoDB Express API in `server/`.
The older SQLite application in `backend/` is not compatible with the React
client and must not be deployed as the Render API service.

## Render API

Create a new Render **Web Service** from this repository (or update the
existing service) with these settings:

| Setting | Value |
| --- | --- |
| Root Directory | `server` |
| Build Command | `npm ci` |
| Start Command | `npm start` |
| Health Check Path | `/health` |

Set the `MONGO_URI` environment variable to the MongoDB connection string.
Set `JWT_SECRET` to a long, private random value. After deployment,
`https://decor-flow-backend.onrender.com/health` must return
`{"status":"ok"}` and a POST to `/api/auth/login` must no longer return 404.

On startup, the API creates an administrator if it does not exist and both
`ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in Render. These credentials remain
under your control and are not stored in the repository.

The included `render.yaml` records the same configuration for a Blueprint
deployment. When changing an existing service, update its Root Directory in
Render and manually redeploy it; committing this file alone does not change an
already-created service.

## Vercel client

Deploy `client/` as the Vercel project root and configure this environment
variable before redeploying:

```
VITE_API_URL=https://decor-flow-backend.onrender.com/api
```

Use the exact Render URL for the deployed API if it differs. Vite embeds this
value at build time, so a Vercel redeploy is required after changing it.
