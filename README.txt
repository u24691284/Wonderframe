WonderFrame - Deliverable 3

WonderFrame is a photo-sharing web application built using React
for the frontend, Express for the backend, and MongoDB Atlas for
the database.


================ PROJECT STRUCTURE ================

/backend  - Express API and MongoDB connection
/frontend - React frontend


================ DOCKER INSTRUCTIONS ================

===BACKEND===

Build the backend Docker image:

docker build -t wonderframe-backend ./backend

Run the backend container:

docker run --env-file ./backend/.env -p 3000:3000 wonderframe-backend


===FRONTEND===

Build the frontend Docker image:

docker build -t wonderframe-frontend ./frontend

Run the frontend container:

docker run -p 5173:5173 wonderframe-frontend


================ ACCESSING THE APPLICATION ================

Both the frontend and backend containers must be running at
the same time.

Frontend:
http://localhost:5173

Backend:
http://localhost:3000


================ DATABASE ================

The application uses MongoDB Atlas.

Create a backend/.env file containing:

MONGO_URI=your_mongodb_atlas_connection_string

The exported MongoDB database is included in the ClickUP submission ZIP.

Ensure the database connection is configured before running the backend.


================ GITHUB REPOSITORY ================

https://github.com/u24691284/Wonderframe