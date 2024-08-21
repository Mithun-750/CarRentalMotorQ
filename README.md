# Car Rental Service

## Overview

This project is a car rental service application built using the MERN stack. It includes both a frontend and a backend component, with the frontend developed in React and the backend in Node.js with Express. It also uses the Context API for state management and Leaflet for maps.

#### Frontend

1. Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```

2. Install the necessary dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

#### Backend

1. Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2. Install the necessary dependencies:
    ```bash
    npm install
    ```

3. Start the server:
    ```bash
    node server.js
    ```

### Admin Setup

To interact with the application as an admin, you'll need to create an admin account manually.

1. Use a tool like Thunder Client or Postman to send a POST request to:
    ```
    http://localhost:5000/api/admins/signup
    ```

2. Use the following example body for the request:
    ```json
    {
        "name": "Mithun",
        "address": "123 Admin St, Admin City, AD",
        "username": "mithun",
        "password": "Mithun@12"
    }
    ```

### Admin Sign-In

To sign in as an admin, navigate to the following route:
```
/admin/signin
```

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **State Management**: Context API
- **Maps**: Leaflet
- **CSS**: Tailwind
