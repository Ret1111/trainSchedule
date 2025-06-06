# Train Schedule Application

A full-stack application for managing train schedules with authentication and CRUD operations.

## Tech Stack

- Frontend:
  - Next.js (React)
  - TypeScript
  - Tailwind CSS
  - JWT Authentication

- Backend:
  - NestJS
  - TypeScript
  - PostgreSQL
  - JWT Authentication

## Project Structure

```
.
├── frontend/     # Next.js application
└── backend/      # NestJS application
```

## Features

- User Authentication (Login/Register)
- Train Schedule Management
  - View schedules
  - Add new schedules
  - Edit existing schedules
  - Delete schedules
- Search and filter functionality
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your database and JWT configuration:
```
DATABASE_URL=postgresql://user:password@localhost:5432/train_schedule
JWT_SECRET=your_jwt_secret
```

4. Run migrations:
```bash
npm run migration:run
```

5. Start the development server:
```bash
npm run start:dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST /auth/register - Register a new user
- POST /auth/login - Login user

### Train Schedules
- GET /schedules - Get all schedules
- GET /schedules/:id - Get specific schedule
- POST /schedules - Create new schedule
- PUT /schedules/:id - Update schedule
- PATCH /schedules/:id - Partial update schedule
- DELETE /schedules/:id - Delete schedule

## Deployment

The application can be deployed to various cloud platforms:
- Backend: Heroku, AWS, or similar
- Frontend: Vercel (recommended for Next.js) or Netlify 