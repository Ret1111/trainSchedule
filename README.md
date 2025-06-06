# Train Schedule Application

A modern web application for managing train schedules with a beautiful UI and real-time updates. The application consists of a Next.js frontend and NestJS backend.

## Live Demo

- Frontend: [https://train-schedule-lmgc.vercel.app](https://train-schedule-lmgc.vercel.app)
- Backend: [https://train-schedule-eta.vercel.app](https://train-schedule-eta.vercel.app)

## Features

- User authentication and authorization
- CRUD operations for train schedules
- Real-time schedule updates
- Responsive and modern UI
- Search and filter functionality
- Platform management
- Active/Inactive schedule status

## Tech Stack

### Frontend
- Next.js 13+ (React framework)
- TypeScript
- Tailwind CSS for styling
- Axios for API requests
- React Icons
- Date-fns for date formatting

### Backend
- NestJS (Node.js framework)
- TypeScript
- PostgreSQL with Prisma ORM
- JWT for authentication
- Swagger for API documentation

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database

## Environment Setup

### Backend (.env)
```
DATABASE_URL="postgresql://username:password@localhost:5432/train_schedule"
JWT_SECRET="your-jwt-secret"
PORT=3001
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd train-schedule
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

## Database Setup

1. Create a PostgreSQL database
2. Update the DATABASE_URL in backend/.env
3. Run migrations:
```bash
cd backend
npx prisma migrate dev
```

## Running the Application

### Backend
```bash
cd backend
npm run start:dev
```
The backend will start on http://localhost:3001

### Frontend
```bash
cd frontend
npm run dev
```
The frontend will start on http://localhost:3000

## API Documentation

Once the backend is running, you can access the Swagger API documentation at:
http://localhost:3001/api

## Deployment

The application is configured for deployment on Vercel:

1. Frontend:
   - Connect your GitHub repository to Vercel
   - Set the environment variables
   - Deploy from the main branch

2. Backend:
   - Connect your GitHub repository to Vercel
   - Set the environment variables
   - Configure the build settings
   - Deploy from the main branch

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details 