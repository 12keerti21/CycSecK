<<<<<<< HEAD
OTP Hash Authentication – README
1. Problem Statement

Implement a simple authentication flow where an OTP is generated on the backend, hashed, and stored temporarily.
The user enters the OTP on the frontend, and the backend verifies it without storing the plain OTP.
(OTP sending to device is not implemented; OTP is shown on the console for testing.)

2. Approach

When a user requests an OTP, the backend:

generates a random 6-digit OTP

hashes it using bcrypt

stores the hash in-memory

returns a success message

The user enters the OTP on the frontend.

The frontend sends the entered OTP to the backend for verification.

The backend:

compares the entered OTP with the stored hash

returns success / failure

This ensures the real OTP is never stored directly, only its hash.

3. Steps to Run the Code
Backend
cd backend
npm install
npm start


Server runs on: http://localhost:5000

Frontend
cd frontend
npm install
npm start


App runs on: http://localhost:3000

4. Expected Output
Backend

When OTP is requested → Console will show the generated OTP (for testing)

API returns:

{ "message": "OTP generated" }


When OTP is submitted →

{ "success": true, "message": "OTP verified" }


or

{ "success": false, "message": "Invalid OTP" }

Frontend

Button to generate OTP

Input field to enter OTP

Message showing "OTP verified" or "Invalid OTP"

5. Assumptions

OTP is shown in the server console instead of sending to a device.

Hash is stored temporarily in-memory (not persisted).

The project is intended for learning/testing purposes only.

OTP expires only when a new one is generated (no time-based expiry implemented).

6. Tools / Libraries Used
Backend

Node.js

Express

Bcrypt (hashing)

CORS

Nodemon (development)

Frontend

React

Axios
=======
OTP Login System

This is a small project that implements a basic OTP login flow using Node.js for the backend and React for the frontend. The OTP is generated on the server, stored as a hashed value, and printed in the console for testing.

Features

Request OTP using email or phone

OTP is hashed before storing

Limit of 3 wrong attempts

Simple session token after successful verification

Minimal React UI (login, verify, welcome)

Running the project:

Backend:
cd backend

npm install

npm start

Frontend:

cd frontend

npm install

npm start


Backend runs on port 5000 and frontend on port 3000.

