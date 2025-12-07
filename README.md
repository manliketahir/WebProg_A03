# Web Programming Assignment 03 - MERN Stack

**Project**: Sports World (MERN Refactor)
**Repo Name**: WebProg_A03

## Description
This project is a MERN stack (MongoDB, Express, React, Node.js) implementation of the Sports World application. It replaces the previous Firebase/static backend with a custom REST API.

## Features
- **Authentication**: JWT-based auth (Register/Login) with bcrypt password hashing.
- **Players CRUD**: Full management of players (Create, Read, Update, Delete).
- **Image Upload**: Upload player images via Multer (stored in `backend/public/uploads`).
- **Dashboard**: User profile management (Update Details, Change Password).
- **Security**: Rate limiting, Helmet headers, Input validation (Joi).
- **Email**: Welcome emails sent upon registration (Nodemailer).

## Prerequisities
- Node.js (v14 or higher)
- MongoDB (Running on `localhost:27017`)

## How to Run

### 1. Backend
1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the server:
    ```bash
    npm start
    ```
    *Server runs on `http://localhost:5000`*

### 2. Frontend
1.  Navigate to the root folder:
    ```bash
    cd ..
    # (or open a new terminal in the project root)
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the React app:
    ```bash
    npm start
    ```
    *App runs on `http://localhost:3000`*

## Admin Access
- **Email**: `admin@sportsworld.com`
- **Password**: `123456`
