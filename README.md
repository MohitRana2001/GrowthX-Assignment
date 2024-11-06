# Assignment Submission Portal

A backend system for managing assignment submissions with user and admin functionality.

## Features

- User and Admin authentication (Local + OAuth2)
- Google and GitHub OAuth integration
- Assignment submission system
- Assignment review system (accept/reject)
- Input validation using Zod
- JWT-based authentication
- MongoDB integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your-mongodb-connection-uri
   JWT_SECRET=your-jwt-secret
   ```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Run tests:
```bash
npm test
```

## API Endpoints

### Authentication Endpoints

#### Local Authentication
- `POST /api/register` - Register a new user
  ```json
  {
    "username": "string",
    "password": "string",
    "isAdmin": boolean (optional)
  }
  ```

- `POST /api/login` - User login
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

### User Endpoints
- `POST /api/upload` - Upload an assignment (requires authentication)
  ```json
  {
    "task": "string",
    "admin": "adminId"
  }
  ```
- `GET /api/admins` - Fetch all admins (requires authentication)

### Admin Endpoints
- `GET /api/assignments` - View assignments (requires admin authentication)
- `POST /api/assignments/:id/accept` - Accept an assignment (requires admin authentication)
- `POST /api/assignments/:id/reject` - Reject an assignment (requires admin authentication)

## Authentication

For API endpoints, include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Testing

The application includes Jest tests for core functionality. Run tests using:
```bash
npm test
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error