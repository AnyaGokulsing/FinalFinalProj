-- DML to INSERT data 
-- Admin
INSERT INTO Admin (firstName, lastName, phoneNum, address, emailAddress)
VALUES 
    ('John', 'Doe', '123-456-7890', '123 Main St, Anytown, USA', 'johndoe@example.com'),
    ('Jane', 'Smith', '987-654-3210', '456 Elm St, Another Town, USA', 'janesmith@example.com');

-- ExerciseProgram
INSERT INTO ExerciseProgram (exerciseProgramName, rep, set, time, flexibility, strength, cardio)
VALUES
    ('Stretching', 10, 3, 30, 8.0, 50.0, 20.0),
    ('Strength', 10, 3, 30, 8.0, 50.0, 20.0),
    ('Proprioception', 10, 3, 30, 8.0, 50.0, 20.0),
    ('Cardio', 10, 3, 30, 8.0, 50.0, 20.0);

-- Members
INSERT INTO Members (firstName, lastName, phoneNum, address, emailAddress, height, weight, exerciseProgramId)
VALUES 
    ('Alice', 'Johnson', '555-123-4567', '789 Oak St, Cityville, USA', 'alice@example.com', 65.5, 140, 1),
    ('Bob', 'Smith', '555-987-6543', '321 Pine St, Villagetown, USA', 'bob@example.com', 70.2, 175, 2);

-- MemberAchievement 
INSERT INTO MemberAchievement (memberId, steps, heartRate, timeToComplete, persoflexibility, persostrength, persocardio)
VALUES 
    (1, 8000, 120.5, 30, 0.75, 0.85, 0.45),
    (2, 10000, 130.2, 45, 0.65, 0.75, 0.85);

-- Trainer
INSERT INTO Trainer (firstName, lastName, phoneNum, address, emailAddress, specialty)
VALUES 
    ('Michael', 'Brown', '333-555-9999', '555 Maple Ave, Townsville, USA', 'michael@example.com', 'Personal Training'),
    ('Sarah', 'Lee', '444-666-7777', '222 Birch St, Countryside, USA', 'sarah@example.com', 'Yoga');


-- Availability
INSERT INTO Availability (startTime, endTime, trainerId)
VALUES
    ('2024-04-01 09:00:00', '2024-04-01 09:59:00',1),
    ('2024-04-01 10:00:00', '2024-04-01 10:59:00',1),
    ('2024-04-01 11:00:00', '2024-04-01 11:59:00',2),
    ('2024-04-01 12:00:00', '2024-04-01 12:59:00',2),
    ('2024-04-01 13:00:00', '2024-04-01 13:59:00',1),
    ('2024-04-01 14:00:00', '2024-04-01 14:59:00',2),
    ('2024-04-01 15:00:00', '2024-04-01 15:59:00',1),
    ('2024-04-01 16:00:00', '2024-04-01 16:59:00',2),
    ('2024-04-01 17:00:00', '2024-04-01 17:59:00',2);
	
-- Room 
INSERT INTO Room (roomName, maxcapacity)
VALUES
    ('Studio A', 20),
    ('Studio B', 15);

-- Equipment
INSERT INTO Equipment (equipmentName)
VALUES
    ('Treadmill'),
    ('Flying machine');

-- RoomBooking
INSERT INTO RoomBooking (roomId, startTime, endTime, bookingTime, reason, adminId)
VALUES
    (1, '2024-04-01 10:00:00', '2024-04-01 11:00:00', '2024-04-01 09:30:00', 'Yoga class', 1),
    (2, '2024-04-01 15:00:00', '2024-04-01 16:00:00', '2024-04-01 14:30:00', 'Strength training', 2);

-- EquipmentMaintenance
INSERT INTO EquipmentMaintenance (equipmentId, requestTime, reason, adminId)
VALUES
    (1, '2024-04-01 09:30:00', 'Maintenance', 1),
    (2, '2024-04-01 14:30:00', 'Maintenance', 2);

-- Classes
INSERT INTO Classes (className, trainerId, roomId, startTime, endTime, price, maxcapacity, groupClass)
VALUES
    ('Yoga Class', 1, 1, '2024-04-01 10:00:00', '2024-04-01 11:00:00', 15.0, 20, TRUE),
    ('Strength Training', 2, 2, '2024-04-01 15:00:00', '2024-04-01 16:00:00', 20.0, 15, FALSE);

-- MemberRegistrations
INSERT INTO MemberRegistrations (memberId, classId)
VALUES
    (1, 1),
    (2, 2);

-- Bill
INSERT INTO Bill (memberId, balance)
VALUES
    (1, 100.0),
    (2, 75.0);
