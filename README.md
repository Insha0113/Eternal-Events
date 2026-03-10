# Eternal Events - Event Management Website

A full-stack event management website with React frontend and Node.js backend.

## Features

### Frontend Pages
- **Home**: Landing page with hero section and features
- **About Us**: Information about the company
- **Our Services**: List of event management services
- **Gallery**: Photo gallery of past events
- **Book Your Event**: Form to book an event
- **Book Host**: Form to book a professional host
- **Admin Login**: Secure admin authentication
- **Admin Dashboard**: Manage and acknowledge bookings

### Backend Features
- RESTful API with Express.js
- JWT-based admin authentication
- Booking management (events and hosts)
- Admin dashboard to view and manage bookings
- Status updates for bookings (pending, confirmed, cancelled)

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies (already installed):
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (already installed):
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

**Note**: Change these credentials in production!

## API Endpoints

### Public Endpoints
- `POST /api/bookings/event` - Submit an event booking
- `POST /api/bookings/host` - Submit a host booking
- `GET /api/health` - Health check

### Admin Endpoints (Requires Authentication)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/bookings` - Get all bookings
- `PUT /api/admin/bookings/:id` - Update booking status
- `DELETE /api/admin/bookings/:id` - Delete a booking

## Project Structure

```
eternal_events/
├── backend/
│   ├── server.js          # Express server
│   ├── data/              # JSON data storage
│   │   ├── bookings.json  # Bookings data
│   │   └── admin.json     # Admin credentials
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   └── Navbar.js
│   │   ├── pages/         # Page components
│   │   │   ├── Home.js
│   │   │   ├── About.js
│   │   │   ├── Services.js
│   │   │   ├── Gallery.js
│   │   │   ├── BookEvent.js
│   │   │   ├── BookHost.js
│   │   │   ├── AdminLogin.js
│   │   │   └── AdminDashboard.js
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json
└── README.md
```

## Usage

1. Start both servers (backend and frontend)
2. Open your browser and navigate to `http://localhost:3000`
3. Browse the website and submit bookings
4. Login as admin at `/admin` to manage bookings
5. Update booking statuses and acknowledge bookings in the admin dashboard

## Technologies Used

### Frontend
- React
- React Router
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- JSON Web Tokens (JWT)
- bcryptjs
- CORS

## Notes

- The backend uses JSON files for data storage. For production, consider using a proper database (MongoDB, PostgreSQL, etc.)
- Admin tokens are stored in localStorage. For better security, consider using httpOnly cookies
- The JWT secret should be changed in production using environment variables
