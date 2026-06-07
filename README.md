# Agricore Enterprise Agriculture Platform

Agricore Enterprise Agriculture Platform is a full-stack agriculture company website and operating system with separate frontend and backend applications. It uses a React + TypeScript frontend, Node.js + Express backend, MongoDB, PostgreSQL, JWT authentication, role-based admin and user workspaces, booking workflows, and Docker Compose.

The goal of this project is to demonstrate senior full-stack engineering fundamentals for an agriculture business platform: secure authentication, first-user administrator bootstrap, role-aware dashboards, booking lifecycle management, admin operational visibility, structured PostgreSQL data, flexible MongoDB documents, validated API contracts, responsive frontend composition, and containerized local development.

## Features

Premium responsive Agricore landing experience with real agriculture video and image media.

Separate frontend and backend folders.

React + TypeScript frontend built with Vite.

Node.js + Express backend with modular routes, controllers, services, middleware, validators, and models.

JWT authentication with password hashing through bcrypt.

Logged-out visitors see the public Agricore website, registration/login, and partnership form.

The top navigation includes a high-contrast `Login / Register` button that jumps directly to the access section.

Logged-in admins see only the admin dashboard workspace.

Logged-in users see only the user dashboard workspace.

First registered account automatically becomes the system ADMIN.

All later registered accounts become USER accounts.

Registration requires full name, username, email, company, and password.

Login accepts username or email plus password.

Admin dashboard can see platform metrics, users, leads, bookings, farm operations, and crop forecasts.

Admin can update booking status across `REQUESTED`, `CONFIRMED`, `IN_PROGRESS`, `COMPLETED`, and `CANCELLED`.

User dashboard can create farm service bookings.

Users can view and cancel their own bookings.

MongoDB stores users, bookings, leads, and impact stories.

PostgreSQL stores structured farm sites and crop forecast data.

Docker Compose starts frontend, backend, MongoDB, and PostgreSQL together.

Backend health endpoint reports MongoDB and PostgreSQL connectivity.

Frontend API helper persists JWT tokens and sends authenticated requests.

Zod validates auth, booking, lead, and admin booking status requests.

Responsive navigation supports desktop and mobile layouts.

Frontend code is split into reusable page sections, auth components, dashboard components, hooks, data files, and formatting utilities.

Backend code is split into thin route files, controllers, service layers, database helpers, models, validators, and middleware.

## Screenshots

### Desktop Home

Agricore desktop homepage with full-screen agriculture video, executive metrics, farm operations, impact stories, secure access, and partnership capture.

![Agricore desktop home](./agricore-home.png)

### Mobile Home

Agricore mobile layout with responsive navigation and optimized first-viewport content.

![Agricore mobile home](./agricore-mobile.png)

## Roles

### Admin

The first person to register becomes ADMIN automatically.

Admins can:

See platform-wide dashboard metrics.

See all registered users.

Promote or demote user roles.

Suspend or reactivate user accounts.

Delete non-self user accounts and their bookings.

See all enterprise partnership leads.

See all user bookings.

Update booking status.

See booking pipeline status counts.

See farm operations watch data and crop confidence signals.

See operating farm and crop forecast data.

Access all public website sections.

### User

Every registration after the first admin becomes USER automatically.

Users can:

Create service bookings.

Review recommended Agricore services.

See next active booking guidance.

View their own bookings.

Cancel active bookings.

Track booking status.

Review the booking lifecycle from requested to completed.

Access public Agricore content.

Submit enterprise partnership requests.

## Authentication Flow

Registration accepts full name, username, email, company, and password.

The backend controls role assignment:

```text
If no users exist:
  first registered account becomes ADMIN

If any user already exists:
  new registered account becomes USER
```

Login accepts username or email and password.

After login, the public marketing sections are intentionally hidden. The app switches into a focused role workspace:

```text
ADMIN -> Admin control room only
USER  -> User booking workspace only
```

Security flow:

```text
React Register/Login Form
        |
        v
Express Auth API
        |
        +--> Zod request validation
        +--> bcrypt password hash/compare
        +--> first-user ADMIN bootstrap
        +--> JWT issued with user role
        |
        v
React stores token in localStorage
        |
        v
API helper sends Authorization: Bearer <token>
        |
        v
Auth middleware validates token
        |
        v
Role middleware protects admin routes
```

## Tech Stack

### Frontend

React 19

TypeScript

Vite

Lucide React icons

CSS responsive layout

Typed API helpers

JWT token persistence in localStorage

Reusable section components

Custom auth hook

Custom data-loading hook

Admin dashboard components

User booking workspace components

Real remote agriculture media assets

### Backend

Node.js

Express

Mongoose

PostgreSQL `pg`

MongoDB

Zod validation

bcryptjs password hashing

jsonwebtoken JWT issuing and verification

Helmet security middleware

CORS configuration

Morgan request logging

Dotenv environment loading

Controller, service, route, middleware, validator, and model layers

### Infrastructure

MongoDB 7

PostgreSQL 16 Alpine

Docker

Docker Compose

Seeded PostgreSQL init script

Internal database networking

Frontend exposed on port 5174

Backend exposed on port 8080

## Architecture

```text
React + TypeScript Frontend
        |
        | HTTP API calls with optional JWT
        v
Node.js + Express API
        |
        +-------------------------+-------------------------+
        |                                                   |
        v                                                   v
MongoDB                                             PostgreSQL
Users                                               Farm sites
Bookings                                            Crop forecasts
Leads
Impact stories
```

## Backend Flow

```text
Client request
        |
        v
Express request middleware
        |
        +--> Helmet security headers
        +--> CORS
        +--> JSON body parsing
        +--> Request logging
        |
        v
Route file
        |
        +--> Optional JWT authentication
        +--> Optional ADMIN role guard
        +--> Optional Zod validation
        |
        v
Controller
        |
        v
Service or model
        |
        +--> MongoDB for users, bookings, leads, stories
        +--> PostgreSQL for operations and forecasts
        |
        v
JSON response
```

## Booking Flow

```text
User creates booking
        |
        v
POST /api/bookings
        |
        v
JWT verifies user
        |
        v
Zod validates booking request
        |
        v
MongoDB stores booking as REQUESTED
        |
        v
Admin sees booking in dashboard
        |
        v
Admin updates status
```

Cancellation flow:

```text
User selects active booking
        |
        v
PATCH /api/bookings/{id}/cancel
        |
        v
JWT verifies ownership
        |
        v
Booking moves to CANCELLED
```

## Project Structure

```text
AGRICULTURE WEBSITE/
  backend/
    .dockerignore                                  Keeps backend Docker build context small
    Dockerfile                                      Container build for Node.js API
    package.json                                    Backend dependencies and scripts
    package-lock.json                               Locked backend dependency versions
    .env.example                                    Local backend environment template
    src/
      app.js                                        Express app composition
      server.js                                     API startup and database connectivity checks

      config/
        env.js                                      Environment variable normalization

      constants/
        apiResources.js                             Public API route metadata

      controllers/
        adminController.js                          Admin metrics, users, and leads
        apiController.js                            Root API metadata response
        authController.js                           Register, login, and current-user APIs
        bookingsController.js                       User and admin booking behavior
        contentController.js                        Impact story API behavior
        healthController.js                         API and database health response
        leadsController.js                          Partnership lead creation
        operationsController.js                     Farm operations response behavior

      db/
        mongo.js                                    MongoDB connection helpers
        postgres.js                                 PostgreSQL pool and query helpers

      middleware/
        authMiddleware.js                           JWT verification and admin role guard
        errorMiddleware.js                          Shared 404 and error JSON handling
        requestMiddleware.js                        Security, CORS, parsing, and logging
        validateRequest.js                          Zod request validation middleware

      models/
        Booking.js                                  MongoDB booking schema
        ImpactStory.js                              MongoDB impact story schema
        Lead.js                                     MongoDB partnership lead schema
        User.js                                     MongoDB user and role schema

      routes/
        admin.js                                    Admin-only API route mapping
        auth.js                                     Public auth and current user route mapping
        bookings.js                                 Authenticated user booking route mapping
        content.js                                  Content API route mapping
        health.js                                   Health API route mapping
        leads.js                                    Lead API route mapping
        operations.js                               Operations API route mapping

      services/
        authService.js                              Password hashing, role assignment, JWT creation
        contentService.js                           Impact story seeding and reads
        operationsService.js                        PostgreSQL aggregation logic

      validators/
        authValidator.js                            Register and login request contracts
        bookingValidator.js                         Booking and admin status request contracts
        leadValidator.js                            Partnership lead request contract

  frontend/
    .dockerignore                                  Keeps frontend Docker build context small
    Dockerfile                                      Container build for Vite frontend
    index.html                                      HTML entry and favicon
    package.json                                    Frontend dependencies and scripts
    package-lock.json                               Locked frontend dependency versions
    tsconfig.json                                   Strict TypeScript configuration
    vite.config.ts                                  Vite dev server configuration
    src/
      main.tsx                                      React bootstrap
      App.tsx                                       Page composition and auth-aware workspace switch
      api.ts                                        Typed API helper, token store, auth calls
      styles.css                                    Global Agricore design system
      types.ts                                      Shared frontend response models
      vite-env.d.ts                                 Vite TypeScript environment reference

      components/
        AdminDashboard.tsx                          Admin command dashboard
        AuthSection.tsx                             Register and login panel
        Footer.tsx                                  Footer and stack signal
        Header.tsx                                  Brand navigation and mobile menu
        Hero.tsx                                    Video hero and primary CTAs
        ImpactSection.tsx                           MongoDB impact story cards
        MediaBand.tsx                               Visual narrative section
        MetricsStrip.tsx                            Operating metric cards
        OperationsSection.tsx                       PostgreSQL farm and forecast dashboard
        PartnerSection.tsx                          Partnership lead form
        PlatformSection.tsx                         Agricore capability messaging
        UserDashboard.tsx                           User booking workspace
        WorkspaceSection.tsx                        Role-aware workspace switch

      data/
        capabilities.ts                             Static capability copy
        media.ts                                    Centralized image and video URLs

      hooks/
        useAgricoreData.ts                          Public page data loading hook
        useAuth.ts                                  Auth session and token management hook

      utils/
        formatters.ts                               Shared number and percent formatting

  infra/
    postgres/
      init.sql                                      PostgreSQL schema and seed data

  docker-compose.yml                                Full local stack orchestration
  README.md                                         Project documentation
  agricore-home.png                                 Desktop verification screenshot
  agricore-mobile.png                               Mobile verification screenshot
```

## Data Storage

### PostgreSQL

PostgreSQL stores structured agriculture operations data.

`farm_sites`

```text
id
name
region
hectares
focus
soil_moisture
water_efficiency
status
updated_at
```

`crop_forecasts`

```text
id
crop
season
projected_yield_tons
confidence
demand_signal
updated_at
```

### MongoDB

MongoDB stores flexible application data.

`users`

```text
username
email
passwordHash
role
fullName
company
status
lastLoginAt
createdAt
updatedAt
```

`bookings`

```text
user
service
farmName
region
hectares
preferredDate
notes
status
cancellationReason
adminNotes
createdAt
updatedAt
```

`leads`

```text
name
email
company
acreage
interest
message
source
createdAt
updatedAt
```

`impactstories`

```text
title
region
metric
summary
category
createdAt
updatedAt
```

## Environment Configuration

Docker Compose provides local defaults:

```text
Frontend:   http://localhost:5174
Backend:    http://localhost:8080
MongoDB:    mongo:27017 inside Docker
PostgreSQL: postgres:5432 inside Docker
```

Important backend environment variables:

```text
NODE_ENV
PORT
MONGO_URI
POSTGRES_HOST
POSTGRES_PORT
POSTGRES_DB
POSTGRES_USER
POSTGRES_PASSWORD
CORS_ORIGIN
JWT_SECRET
JWT_EXPIRES_IN
```

Important frontend environment variable:

```text
VITE_API_URL
```

Use a long rotated `JWT_SECRET`, managed database credentials, TLS, and production CORS origins outside local development.

## Run With Docker

Start the full stack:

```bash
docker compose up --build
```

Run in the background:

```bash
docker compose up --build -d
```

Open:

```text
Frontend: http://localhost:5174
Backend:  http://localhost:8080/api
Health:   http://localhost:8080/api/health
```

Check containers:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs --tail=100 backend
docker compose logs --tail=100 frontend
docker compose logs --tail=100 mongo
docker compose logs --tail=100 postgres
```

Stop containers:

```bash
docker compose down
```

Fresh start with clean database volumes:

```bash
docker compose down -v
docker compose up --build
```

This deletes local MongoDB and PostgreSQL data. After a clean volume reset, the next registration becomes the first ADMIN again.

MongoDB stores users in a Docker volume. Restarting containers without `-v` keeps existing users, so the next registration will be a USER if an admin account already exists.

## Local Frontend Commands

If you want to work on the React app outside Docker:

```bash
cd frontend
npm.cmd install
npm.cmd run build
npm.cmd run dev
```

PowerShell may block `npm.ps1` depending on execution policy, so `npm.cmd ...` is the safer Windows command form.

## Local Backend Commands

If MongoDB and PostgreSQL are already running through Docker:

```bash
cd backend
npm.cmd install
npm.cmd run dev
```

Backend scripts:

```text
npm.cmd run dev      Starts Node with watch mode
npm.cmd start        Starts the API normally
npm.cmd run lint     Runs syntax checks for app and server entry files
```

## Main Sections

```text
#top          Hero and brand positioning
#platform     Platform capabilities
#operations   Farm sites and crop forecasts
#impact       Sustainability and impact stories
#access       Register and login
#partner      Enterprise partnership lead form
```

Authenticated users do not see these public sections after login. They are routed into the role-specific workspace only.

## API Routes

### Health

```text
GET /api/health
```

Returns API uptime plus MongoDB and PostgreSQL dependency status.

### Auth

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

Register request:

```json
{
  "username": "admin",
  "email": "admin@agricore.test",
  "password": "Password123",
  "fullName": "Agricore Admin",
  "company": "Agricore"
}
```

Login request:

```json
{
  "identifier": "admin",
  "password": "Password123"
}
```

### User Bookings

```text
GET   /api/bookings
POST  /api/bookings
PATCH /api/bookings/{id}/cancel
```

Booking request:

```json
{
  "service": "Precision farm assessment",
  "farmName": "Green Valley Estate",
  "region": "Western Cape",
  "hectares": 5000,
  "preferredDate": "2026-07-15",
  "notes": "Assess irrigation efficiency and crop forecasting."
}
```

### Admin

```text
GET   /api/admin/overview
GET   /api/admin/users
PATCH /api/admin/users/{id}
DELETE /api/admin/users/{id}
GET   /api/admin/leads
GET   /api/admin/bookings
PATCH /api/admin/bookings/{id}/status
```

Admin status update:

```json
{
  "status": "CONFIRMED",
  "adminNotes": "Assigned to field operations team."
}
```

Admin user update:

```json
{
  "role": "USER",
  "status": "ACTIVE"
}
```

### Operations

```text
GET /api/operations/overview
```

Returns operating metrics, farm sites, and crop forecasts from PostgreSQL.

### Content

```text
GET /api/content/impact
```

Returns impact stories from MongoDB. The service seeds default stories if the collection is empty.

### Leads

```text
POST /api/leads
```

Creates a partnership request in MongoDB.

## Verification

The stack was verified with:

```bash
npm.cmd install
npm.cmd run build
npm.cmd run lint
docker compose config
docker compose up --build -d
docker compose ps
Invoke-RestMethod http://localhost:8080/api/health
curl.exe -I http://localhost:5174
```

Backend source files were syntax checked with:

```powershell
Get-ChildItem backend\src -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
```

Expected result:

```text
React TypeScript production build succeeds.
Frontend TypeScript no-emit check succeeds.
Backend JavaScript syntax checks succeed.
Docker Compose configuration is valid.
MongoDB container starts.
PostgreSQL container starts and becomes healthy.
Backend starts on port 8080.
Frontend starts on port 5174.
Frontend returns 200 OK.
Backend health endpoint returns ok.
MongoDB reports connected.
PostgreSQL reports connected.
Browser console shows zero errors.
```

## Senior Engineering Signals

Separate frontend and backend applications.

Docker Compose reproduces the local environment.

First-user admin bootstrap is controlled by the backend.

Passwords are hashed with bcrypt.

JWTs are issued by a dedicated auth service.

JWT verification is centralized in auth middleware.

Admin authorization is handled by role middleware.

Admin user management prevents deleting or suspending the active admin account.

Admin role changes protect against removing the last active admin.

PostgreSQL is used for structured operational data.

MongoDB is used for users, bookings, flexible content, and lead capture.

Express route files are thin and delegate behavior to controllers.

Controllers are separated from services and persistence models.

Request validation is centralized with Zod middleware.

Error responses are centralized in shared middleware.

Security headers are applied with Helmet.

CORS is configured from environment variables.

Frontend sections are split into reusable components.

Frontend auth session state is centralized in a custom hook.

Frontend public data loading is centralized in a custom hook.

Formatting helpers prevent duplicated number and percent formatting logic.

Shared TypeScript types mirror backend response shapes.

Admin and user dashboards are separated into dedicated components.

PostgreSQL initialization script creates schema and seed data automatically.

Local dependency lockfiles support reproducible installs.

The README documents architecture, auth, roles, routes, data storage, run commands, and verification.

## Notes

This is a portfolio-grade local development platform and a strong foundation for an enterprise agriculture product. It is not yet a hardened production deployment.

Production improvements should include refresh tokens, password reset, email verification, account lockout controls, audit logs, rate limiting, RBAC permissions beyond role names, admin user management actions, structured logging, distributed tracing, metrics dashboards, object storage for first-party media, a CDN, managed database backups, TLS, secret management, CI/CD, automated tests, image scanning, and production-grade MongoDB/PostgreSQL configurations.
