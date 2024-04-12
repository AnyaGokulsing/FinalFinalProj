### COMP 3005 Final Project 

Author: Anya Gokulsing (101170595)

---

Hello! This README provides setup instructions for the COMP 3005 final project. For detailed project specifications, please refer to the [PDF README](https://github.com/AnyaGokulsing/FinalFinalProj/files/14962207/READMETeam90COMP3005FinalProj.pdf) submitted on Brightspace.

#### Project Setup Instructions

**Database Side Setup:**

1. Set up the database using the files in the SQL folder (`DDLFile` + `DMLFile`) or copy the `database.sql` file in `./server` and run it locally in pgAdmin.

   **Important Note:** Modify the database connection details (`host`, `password`, `port`, `database name`, `user`) according to your PostgreSQL server settings. The pool connects the server to the database instance. Test the connection by visiting `http://localhost:5000/test-db-connection`.

**Server Side Setup:**

1. To start the server on port 5000, navigate to `FinalFinalProj/server`:

   - Download all the required libraries using npm:
     ```
     npm install
     ```
   - Start the server:
     ```
     node index.js
     ```

**Client Side Setup:**

Clients represent users with hardcoded IDs (`1` for `trainerId`, `adminId`, `memberId` for Trainer, Admin, and Members respectively). React with Bootstrap 5 was used to create the clients (more details in the [PDF README](https://github.com/AnyaGokulsing/FinalFinalProj/files/14962207/READMETeam90COMP3005FinalProj.pdf)).

2. To start the `client2` for Trainers on port 3000, navigate to `FinalFinalProj/client2`:
   ```
   cd FinalFinalProj/client2
   npm install
   npm start
   ```

3. To start the `client3` for Admin on port 3001, navigate to `FinalFinalProj/client3`:
   ```
   cd FinalFinalProj/client3
   npm install
   npm start
   ```

4. To start the `client4` for Members on port 3002, navigate to `FinalFinalProj/client4`:
   ```
   cd FinalFinalProj/client4
   npm install
   npm start
   ```

Monitor your terminal for prompts (Y or N) to select which port to run each React client. Example setup:

- `client2` (Trainers) on `http://localhost:3000`
- `client3` (Admin) on `http://localhost:3001`
- `client4` (Members) on `http://localhost:3002`

Inspect the DevTools pane for details on requests, responses, and client-side checks for input sanitization and error handling (e.g., `startTime > endTime`, null searches, duplicate class registrations, basic error handling).
