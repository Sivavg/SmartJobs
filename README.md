# Smart Job Portal

A full-stack job portal application built with React, Node.js, Express, and MySQL.

## Features

- **Authentication**: JWT-based auth for Candidates and Recruiters.
- **Jobs**: Browse, search, filter, and view job details.
- **Recruiters**: Post jobs, view dashboard.
- **Candidates**: Apply for jobs with resume upload, track applications.
- **Responsive Design**: Built with Tailwind CSS.

## Setup Instructions

### Prerequisites

- Node.js installed
- MySQL installed and running

### Database Setup

1. Create a MySQL database named `job_portal_db`.
2. Update `server/.env` with your database credentials.

### Backend Setup

1. Navigate to `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Axios
- **Backend**: Node.js, Express, Sequelize (ORM), MySQL
- **Auth**: JWT, Bcrypt
