const express = require("express");
const cors = require("cors");
const pool = require("./db");
const path = require("path"); // Import the path module
const { Console } = require("console");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//test conn
app.get("/test-db-connection", async (req, res) => {
    try {
        const testQueryResult = await pool.query("SELECT * FROM members");
        res.json(testQueryResult.rows);
    } catch (error) {
        console.error("Error connecting to database:", error.message);
        res.status(500).json({ error: "Failed to connect to database" });
    }
});


// Member Functions
//Add new member
app.post("/members", async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            phoneNum,
            address,
            emailAddress,
            height,
            weight,
            exerciseProgramId,
            achievementid,
            strength,
            flexibility,
            cardio
        } = req.body;
        const newMember = await pool.query(
            "INSERT INTO Members (firstName, lastName, phoneNum, address, emailAddress, height, weight, exerciseProgramId, achievementid, strength, flexibility, cardio) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
            [firstName, lastName, phoneNum, address, emailAddress, height, weight, exerciseProgramId, achievementid, strength, flexibility, cardio]
        );
        res.json(newMember.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});
//update personal info
app.put("/members/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const {
            firstName,
            lastName,
            phoneNum,
            address,
            emailAddress
        } = req.body;
        const updateMember = await pool.query(
            "UPDATE Members SET firstName = $1, lastName = $2, phoneNum = $3, address = $4, emailAddress = $5 WHERE memberId = $6",
            [firstName, lastName, phoneNum, address, emailAddress, id]
        );
        res.json("Member updated");
    } catch (err) {
        console.error(err.message);
    }
});
//update fitness goals
app.put("/members/:id/fitness", async (req, res) => {
    try {
        const { id } = req.params;
        const {
            exerciseProgramId,
            strength,
            flexibility,
            cardio
        } = req.body;
        const updateFitness = await pool.query(
            "UPDATE Members SET exerciseProgramId = $1, strength = $2, flexibility = $3, cardio = $4 WHERE memberId = $5",
            [exerciseProgramId, strength, flexibility, cardio, id]
        );
        res.json("Fitness goals updated");
    } catch (err) {
        console.error(err.message);
    }
});
//view fitness goals
app.get("/members/:id/fitness", async (req, res) => {
    try {
        const { id } = req.params;
        const fitnessStats = await pool.query(
            "SELECT strength, flexibility, cardio FROM Members WHERE memberId = $1",
            [id]
        );
        res.json(fitnessStats.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});
//get classes a member is registered in
app.get("/members/:memberId/classes", async (req, res) => {
    try {
        const { memberId } = req.params;
        const memberClasses = await pool.query(
            "SELECT c.classId, c.currentcapacity, c.startTime, c.endTime, c.trainerId, c.roomId, c.groupClass FROM MemberRegistrations mr JOIN Classes c ON mr.classId = c.classId WHERE mr.memberId = $1",
            [memberId]
        );
        res.json(memberClasses.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch member's classes" });
    }
});

// Register a member in a personal training session
app.post("/members/:memberId/personalTraining", async (req, res) => {
    try {
      const { memberId } = req.params;
      const {
        trainerId,
        roomId,
        startTime,
        endTime,
        price,
        maxcapacity,
        availabilityId,
        className,
        exerciseProgramId,
      } = req.body;
      console.log(  [trainerId, startTime, endTime]);
    console.log("availabilityId herererere")
      console.log(availabilityId);

      // Begin a transaction to register the member in the personal training session
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        console.log("DELETE herererere")
        // Remove the trainer's availability for the requested time
        await client.query(
          "DELETE FROM Availability WHERE availabilityId = $1",
          [availabilityId]
        );
        console.log("INSERT herererere");
        // Create a non-group class for the personal training session
        const newClass = await client.query(
          "INSERT INTO Classes (trainerId, roomId, startTime, endTime, price, maxcapacity, exerciseProgramid, groupClass, currentcapacity, className) VALUES ($1, $2, $3, $4, $5, $6, $7, false, 1,$8) RETURNING *",
          [trainerId, roomId, startTime, endTime, price, maxcapacity, exerciseProgramId, className]
        );
        console.log("UPDATE herererere");
        console.log(newClass);
        const classId = newClass.rows[0].classid;
  
        const classPrice = newClass.rows[0].price;
        // Charge member by updating the balance in the Bill table
        await client.query(
            "UPDATE Bill SET balance = balance + $1 WHERE accountId = $2 RETURNING *",
            [classPrice, memberId]
        );
        console.log("INSERT herererere")
            console.log([classId, memberId]);
        // Register the member in the class
        await client.query(
          "INSERT INTO MemberRegistrations (memberId, classId) VALUES ($1, $2) RETURNING *",
          [memberId, classId]
        );
        console.log("COMMIT herererere")

        // Commit the transaction
        await client.query("COMMIT");
  
        res.json({ message: "Registered for personal training session successfully" });
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      } finally {
        client.release();
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Failed to register for personal training session" });
    }
  });
  

// Register a member in a personal training session
app.post("/members/:memberId/personalTraining", async (req, res) => {
    try {
      const { memberId } = req.params;
      const {
        trainerId,
        roomId,
        startTime,
        endTime,
        price,
        maxcapacity,
        availabilityId,
        className,
        exerciseProgramId,
      } = req.body;
  
      // Check if the member is already registered in the specified class
      const existingRegistration = await pool.query(
        "SELECT * FROM MemberRegistrations WHERE memberId = $1 AND classId IN (SELECT classId FROM Classes WHERE trainerId = $2 AND startTime = $3 AND endTime = $4)",
        [memberId, trainerId, startTime, endTime]
      );
  
      if (existingRegistration.rows.length > 0) {
        return res.status(400).json({ error: "Member is already registered in this class" });
      }
  
      // Begin a transaction to register the member in the personal training session
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
  
        // Remove the trainer's availability for the requested time
        await client.query("DELETE FROM Availability WHERE availabilityId = $1", [availabilityId]);
  
        // Create a non-group class for the personal training session
        const newClass = await client.query(
          "INSERT INTO Classes (trainerId, roomId, startTime, endTime, price, maxcapacity, exerciseProgramid, groupClass, currentcapacity, className) VALUES ($1, $2, $3, $4, $5, $6, $7, false, 1, $8) RETURNING *",
          [trainerId, roomId, startTime, endTime, price, maxcapacity, exerciseProgramId, className]
        );
  
        const classId = newClass.rows[0].classid;
        const classPrice = newClass.rows[0].price;
  
        // Charge member by updating the balance in the Bill table
        await client.query("UPDATE Bill SET balance = balance + $1 WHERE accountId = $2 RETURNING *", [classPrice, memberId]);
  
        // Register the member in the class
        await client.query("INSERT INTO MemberRegistrations (memberId, classId) VALUES ($1, $2) RETURNING *", [memberId, classId]);
  
        // Commit the transaction
        await client.query("COMMIT");
  
        res.json({ message: "Registered for personal training session successfully" });
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      } finally {
        client.release();
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Failed to register for personal training session" });
    }
  });
  

app.get("/members/:memberId/balance", async (req, res) => {
    try {
      const { memberId } = req.params;
      console.log("Fetching balance for member ID:", memberId);
  
      const memberBalance = await pool.query(
        "SELECT balance FROM Bill WHERE memberId = $1",
        [memberId]
      );
  
      if (memberBalance.rows.length === 0) {
        console.log("Member not found for ID:", memberId);
        return res.status(404).json({ error: "Member not found" });
      }
  
      const balance = memberBalance.rows[0].balance;
      console.log(memberBalance);
      res.json({ balance });
    } catch (err) {
      console.error("Error fetching member balance:", err.message);
      res.status(500).json({ error: "Failed to fetch member balance" });
    }
  });
  


// Delete a class from member's schedule
app.delete("/members/:memberId/classes/:classId", async (req, res) => {
    try {
        const { memberId, classId } = req.params;
        await pool.query("DELETE FROM MemberRegistrations WHERE memberId = $1 AND classId = $2", [memberId, classId]);
        // Decrement the current capacity of the class
        await pool.query(
            "UPDATE Classes SET currentcapacity = currentcapacity - 1 WHERE classId = $1",
            [classId]
        );

        res.json({ message: "Class deleted from member's schedule" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to delete class from member's schedule" });
    }
});

//display health statistics
app.get("/members/:memberId/healthStatistics", async (req, res) => {
    try {
        const { memberId } = req.params;
        const healthStatistics = await pool.query(
            "SELECT strength, flexibility, cardio FROM Members WHERE memberId = $1",
            [memberId]
        );
        res.json(healthStatistics.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});
//display fitness achievements
app.get("/members/:memberId/fitnessAchievements", async (req, res) => {
    try {
        const { memberId } = req.params;
        const fitnessAchievements = await pool.query(
            "SELECT * FROM MemberAchievement WHERE memberId = $1",
            [memberId]
        );
        res.json(fitnessAchievements.rows);
    } catch (err) {
        console.error(err.message);
    }
});
//display exercise program
app.get("/members/:memberId/exerciseProgram", async (req, res) => {
    try {
        const { memberId } = req.params;
        const exerciseProgram = await pool.query(
            "SELECT * FROM ExerciseProgram WHERE exerciseProgramId = (SELECT exerciseProgramId FROM Members WHERE memberId = $1)",
            [memberId]
        );
        res.json(exerciseProgram.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});
//update exercise program
app.put("/members/:memberId/exerciseProgram", async (req, res) => {
    try {
        const { memberId } = req.params;
        const { exerciseProgramId } = req.body;
        const updateExerciseProgram = await pool.query(
            "UPDATE Members SET exerciseProgramId = $1 WHERE memberId = $2",
            [exerciseProgramId, memberId]
        );
        res.json("Exercise program updated");
    } catch (err) {
        console.error(err.message);
    }
});
//update health metrics
app.put("/members/:memberId/healthMetrics", async (req, res) => {
    try {
        const { memberId } = req.params;
        const { strength, flexibility, cardio } = req.body;
        const updateHealthMetrics = await pool.query(
            "UPDATE Members SET strength = $1, flexibility = $2, cardio = $3 WHERE memberId = $4",
            [strength, flexibility, cardio, memberId]
        );
        res.json("Health metrics updated");
    } catch (err) {
        console.error(err.message);
    }
});
// Trainer Functions
//add availability
app.post("/trainers/availability", async (req, res) => {
    try {
        const { startTime, endTime, trainerId } = req.body;
        const newAvailability = await pool.query(
            "INSERT INTO Availability (startTime, endTime, trainerId) VALUES ($1, $2, $3) RETURNING *",
            [startTime, endTime, trainerId]
        );
        res.json(newAvailability.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});
//get all available trainers at time t
app.get("/trainers/available/:starttime/:endtime", async (req, res) => {
    try {
        const { starttime, endtime } = req.params;
        const availableTrainers = await pool.query(
            "SELECT Availability.availabilityid,Availability.starttime, Availability.endtime, Trainer.firstName, Trainer.lastName, Trainer.trainerId FROM Trainer JOIN Availability ON Trainer.trainerId = Availability.trainerId WHERE startTime >= $1 AND endTime <= $2",
            [starttime, endtime]
        );
        res.json(availableTrainers.rows);
    } catch (err) {
        console.error(err.message);
    }
});
//find a member using firstname and lastname
app.get("/trainers/member/:firstName/:lastName", async (req, res) => {
    try {
        const { firstName, lastName } = req.params;
        const trainerAndMemberDetails = await pool.query(
            "SELECT Members.*, ExerciseProgram.* FROM Members JOIN ExerciseProgram ON Members.exerciseProgramId = ExerciseProgram.exerciseProgramId WHERE firstName = $1 AND lastName = $2",
            [firstName, lastName]
        );
        res.json(trainerAndMemberDetails.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Administrative Staff Functions
app.post("/admin/roomBooking", async (req, res) => {
    try {
      const { roomId, startTime, endTime, reason, adminId } = req.body;
  
      // Check if the room is already booked for the given time range
      const existingBooking = await pool.query(
        "SELECT * FROM RoomBooking WHERE roomId = $1 AND ($2 BETWEEN startTime AND endTime OR $3 BETWEEN startTime AND endTime)",
        [roomId, startTime, endTime]
      );
  
      if (existingBooking.rows.length > 0) {
        // Room is already booked for the given time range
        return res.status(400).json({ error: "Room is already booked for this time range" });
      }
  
      // Room is available, proceed to create the new booking
      const newBooking = await pool.query(
        "INSERT INTO RoomBooking (roomId, startTime, endTime, bookingTime, reason, adminId) VALUES ($1, $2, $3, NOW(), $4, $5) RETURNING *",
        [roomId, startTime, endTime, reason, adminId]
      );
  
      res.status(201).json(newBooking.rows[0]); // Return the newly created booking
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Failed to add room booking" });
    }
  });
  
//get booking history for a room
app.get("/admin/roomBooking/history/:roomId", async (req, res) => {
    try {
        const { roomId } = req.params;
        const bookingHistory = await pool.query(
            "SELECT bookingid, bookingTime, reason, adminId FROM RoomBooking WHERE roomId = $1",
            [roomId]
        );
        res.json(bookingHistory.rows);
    } catch (err) {
        console.error(err.message);
    }
});
//add equipment maintenance
app.post("/admin/equipmentMaintenance", async (req, res) => {
    try {
        const { equipmentId, adminId } = req.body;
        const maintenanceEntry = await pool.query(
            "INSERT INTO EquipmentMaintenance (equipmentId, requestTime, reason, adminId) VALUES ($1, NOW(), 'Maintenance', $2) RETURNING *",
            [equipmentId, adminId]
        );
        res.json(maintenanceEntry.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});
//get equipment maintenance history
app.get("/admin/equipmentMaintenance/history/:equipmentId", async (req, res) => {
    try {
        const {equipmentId} = req.params;
        const maintenanceHistory = await pool.query(
            "SELECT maintenanceid,equipmentId,requesttime,adminid,reason FROM EquipmentMaintenance WHERE equipmentId= $1", 
            [equipmentId]
        );
        res.json(maintenanceHistory.rows);
    } catch (err) {
        console.error(err.message);
    }
});
// Route to pay a bill and update balance to zero
app.post("/payBill/:accountId", async (req, res) => {
      try {
        const {accountId} = req.params; // Assuming you want to pay the bill for account ID 1
      // Perform the SQL update to set balance to zero for the specified account ID
        const updateBill = await pool.query(
        "UPDATE Bill SET balance = 0.0 WHERE accountid = $1  RETURNING *",
        [accountId]
      );
  
      res.json(updateBill.rows);
    } catch (error) {
      console.error("Error paying bill:", error.message);
      res.status(500).json({ error: "Failed to pay bill" });
    }
  });
//modify a class
app.put("/admin/classes/:classId", async (req, res) => {
    try {
        const { classId } = req.params;
        const {
            startTime,
            endTime,
            trainerId,
            maxcapacity,
            price,
            roomId,
            exerciseProgramId,
            isGroupClass
        } = req.body;
        const updateClass = await pool.query(
            "UPDATE Classes SET startTime = $1, endTime = $2, trainerId = $3, maxcapacity = $4, price = $5, roomId = $6, exerciseProgramId = $7, isGroupClass = $8 WHERE classId = $9",
            [startTime, endTime, trainerId, maxcapacity, price, roomId, exerciseProgramId, isGroupClass, classId]
        );
        res.json("Class updated");
    } catch (err) {
        console.error(err.message);
    }
});
// get classes based on a datetime picker entry
app.get("/classes", async (req, res) => {
    try {
      const { datetime } = req.query; // Assuming datetime is provided as a query parameter
      const parsedDatetime = new Date(datetime);
      // Query classes that start any time on or after datetime until 24 hours after by using INTERVAL '24 hours'
      const classes = await pool.query(
        "SELECT * FROM Classes WHERE startTime >= $1 AND endTime <= ($1 + INTERVAL '24 hours')",
        [parsedDatetime]
      );
      res.json(classes.rows);
      
    } catch (err) {
      console.error("Error fetching classes:", err.message);
      res.status(500).json({ error: "Failed to fetch classes" });
    }
  });
// Route to add a new class
app.post("/admin/classes", async (req, res) => {
    try {
        const {
            startTime,
            endTime,
            className,
            trainerId,
            maxcapacity,
            price,
            roomId,
            exerciseProgramId
        } = req.body;

        // Insert the new class into the database
        const newClass = await pool.query(
            "INSERT INTO Classes (startTime, endTime, className, trainerId, maxcapacity, price, roomId, groupClass, exerciseProgramId) VALUES ($1, $2, $3, $4, $5, $6, $7, 'yes', $8) RETURNING *",
            [startTime, endTime, className, trainerId, maxcapacity, price, roomId, exerciseProgramId]
        );

        res.status(201).json(newClass.rows[0]); // Return the newly created class
    } catch (err) {
        console.error("Error adding class:", err.message);
        res.status(500).json({ error: "Failed to add class" });
    }
});

//delete a class
app.delete("/admin/classes/:classId", async (req, res) => {
    try {
        const { classId } = req.params;
        const deleteClass = await pool.query(
            "DELETE FROM Classes WHERE classId = $1",
            [classId]
        );
        res.json("Class deleted");
    } catch (err) {
        console.error(err.message);
    }
});

app.listen(5000, () => {
    console.log("Server listening on port 5000");
});
