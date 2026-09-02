WonderFrame - Deliverable 1

WonderFrame is a photo-sharing web application built using React for the frontend and Express for the backend.

=============DOCKER INSTRUCTIONS============

####Backend

Build the backend Docker image:
docker build -t wonderframe-backend ./backend

Run the backend container:
docker run -p 3000:3000 wonderframe-backend


#####Frontend

Build the frontend Docker image:
docker build -t wonderframe-frontend ./frontend

Run the frontend container:
docker run -p 5173:5173 wonderframe-frontend


==========ACCESSING THE APPLICATION===============

Once both containers are running, open the following in a browser:

http://localhost:5173


==================IMPORTANT====================

Both the frontend and backend containers must be running at the same time.

Frontend runs on port 5173.
Backend runs on port 3000.


===============GITHUB REPOSITORY=================

https://github.com/u24691284/Wonderframe






