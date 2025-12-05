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
