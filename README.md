Name: Anya Gokulsing                             Student ID: 101170595
Group Number: 90
COMP 3005 Final Project


Hi! :)


This README is just to set up the project. The required README with the ER diagram, Relational Schema, DML + DDL files and the queries for each function required from the specs is in the file READMETeam90COMP3005FinalProj.pdf submitted on Brightspace which you can also find in this project.

Instructions to set up the project:
A) Database side setup
Set up the database using the files in the SQL folder (DDLFile + DMLFile) or copy the database.sql file in ./server and run this locally in pgAdmin. 

IMPORTAMT NOTE: Please change the host, password, port, database name and user to the values of your PostgreSQL server. The pool connects the server to the DB instance. You can check if the connection is successful by going to the route 'http://localhost:5000/test-db-connection'.

B) Server Side setup
1) To start the server on port 5000 in FinalFinalProj/server:
Download all the libraries using npm (npm start + npm init )
Then run node index.js

The clients each represent a user with hardcoded id of 1 (id here refers to trainerId, adminId, memberId for Trainer, Members and Admin respectively).
The clients were created using npx create-react-app and React with Bootstrap5 (more info in the READMETeam90COMP3005FinalProj.pdf)
To start the clients (React Views for the users since I could not use Passport with the Express server for some reason):
Monitor your terminal as you will be asked to confirm (Y or N) on which port to run which React client. An example setup is:

2) To start the client2 for Trainer on port 3000
Go to FinalFinalProj/client2: npm start 

3) To start the client3 for Admin on port 3001
Go to FinalFinalProj/client3: npm start 

4) To start the client4 for Member on port 3002
Go to FinalFinalProj/client4: npm start 

Check in the DevTools pane to see what values and request/response are being sent as well as the client side checks for basic input sanitization and to potentially block bad requests (Ex startTime>endTime + null searches + registering in a class which is already in your schedule + basic errors).

