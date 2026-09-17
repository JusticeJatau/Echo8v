# Echo8V company website

A React/Vite frontend with a separate Express/MongoDB backend. The public website and admin keep separate responsibilities: React displays the interface, while Express handles authentication, content, enquiries, Resend, and Backblaze.

## Project structure

```text
frontend/
  public/media/        fixed Echo8V logo, founder photo, favicon
  src/api/api.js       frontend API helper
  src/components/      shared UI
  src/context/         AuthContext and ThemeContext only
  src/layout/          public and admin layouts
  src/pages/           public pages and admin pages

backend/
  config/              MongoDB connection
  controllers/         request handling
  middleware/          admin authentication
  models/              MongoDB schemas
  routes/              API routes
  services/            Backblaze and Resend
  scripts/             admin and starter-content seeds
```

There is no SiteContext. Each page requests only the data it needs. Fixed brand assets are loaded directly from `/media` and are never requested from MongoDB.

## Setup

Requirements: Node.js 22 or newer and MongoDB.

```bash
npm install
```

Copy `backend/.env.example` to `backend/.env`, fill in the values, then run:

```bash
npm run seed:admin
npm run seed:content
npm run dev
```

- Website: http://localhost:5173
- Admin: http://localhost:5173/admin

## Environment variables

```dotenv
PORT=5000
MONGODB_URI=
JWT_SECRET=
SITE_ORIGIN=http://localhost:5173
NODE_ENV=development

ADMIN_NAME=Justice Yakubu Jatau
ADMIN_EMAIL=jataujustice200@gmail.com
ADMIN_PASSWORD=

B2_ENDPOINT=
B2_REGION=
B2_BUCKET=
B2_KEY_ID=
B2_APPLICATION_KEY=
B2_PUBLIC_URL=

RESEND_API_KEY=
RESEND_FROM=Echo8V <notifications@echo8v.com>
ENQUIRY_NOTIFICATION_TO=jataujustice200@gmail.com
```

Create a public Backblaze B2 bucket for website images and a bucket-scoped application key. `B2_PUBLIC_URL` is the public bucket root. Resend requires a verified sending domain for `RESEND_FROM`.

## Simple data flow

```text
React page → frontend/src/api/api.js → Express route → controller → MongoDB model
```

New enquiries are saved in MongoDB. The backend then makes one Resend request. If it fails, the enquiry remains in the admin with a Retry email button.

Admin media uploads go from React to Express and then to Backblaze. MongoDB stores the returned file URL and key. Fixed assets such as the company logo and founder photo remain in `frontend/public/media`.

## Production

Build the frontend:

```bash
npm run build
```

Set production environment variables, set `SITE_ORIGIN` to the exact HTTPS domain, and run:

```bash
npm start
```

Express serves the built frontend and API from one deployment. During development, Vite sends `/api` requests to the backend on port 5000.
