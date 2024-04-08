-- CREATE DATABASE perntodo;
-- CREATE TABLE todo(
--     todoid SERIAL PRIMARY KEY,
--     descrip VARCHAR(255)
-- );
CREATE DATABASE comp3005finalproj;
--DDL to CREATE
CREATE TABLE Admin (
    adminId SERIAL PRIMARY KEY,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    phoneNum VARCHAR(20),
    address VARCHAR(255),
    emailAddress VARCHAR(255)
);
CREATE TABLE ExerciseProgram (
    exerciseProgramId SERIAL PRIMARY KEY,
    exerciseProgramName TEXT,
    rep INT,
    set INT,
    time INT,
    flexibility DOUBLE PRECISION,
    strength DOUBLE PRECISION,
    cardio DOUBLE PRECISION
);
CREATE TABLE Members(
    memberId SERIAL PRIMARY KEY,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    phoneNum VARCHAR(20),
    address VARCHAR(255),
    emailAddress VARCHAR(255),
    height DOUBLE PRECISION,
    weight DOUBLE PRECISION,
    exerciseProgramId INT REFERENCES ExerciseProgram(exerciseProgramId ),
    strength DOUBLE PRECISION,
    flexibility DOUBLE PRECISION,
    cardio DOUBLE PRECISION
);
CREATE TABLE MemberAchievement(
    achievementid SERIAL PRIMARY KEY,
	memberId INT REFERENCES Members(memberId),
    steps INT,
    heartRate DOUBLE PRECISION,
    timeToComplete INT,
    persoflexibility DOUBLE PRECISION,
    persostrength DOUBLE PRECISION,
    persocardio DOUBLE PRECISION
);
CREATE TABLE Trainer (
    trainerId SERIAL PRIMARY KEY,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    phoneNum VARCHAR(20),
    address VARCHAR(255),
    emailAddress VARCHAR(255),
    specialty VARCHAR(255)
);
CREATE TABLE Availability(
     availabilityId SERIAL PRIMARY KEY,
     startTime TIMESTAMP,
     endTime TIMESTAMP,
     trainerId INT REFERENCES Trainer(trainerId)
);
CREATE TABLE Room (
    roomId SERIAL PRIMARY KEY,
    roomName VARCHAR(255),
    maxcapacity INT
);
CREATE TABLE Equipment (
    equipmentId SERIAL PRIMARY KEY,
    equipmentName VARCHAR(255)
);
CREATE TABLE RoomBooking (
    bookingId SERIAL PRIMARY KEY,
    roomId INT REFERENCES Room(roomId),
    startTime TIMESTAMP,
    endTime TIMESTAMP,
    bookingTime TIMESTAMP,
    reason VARCHAR(255),
    adminId INT REFERENCES Admin(adminId)
);
CREATE TABLE EquipmentMaintenance (
    maintenance SERIAL PRIMARY KEY,
    equipmentId INT REFERENCES Equipment(equipmentId), 
    requestTime TIMESTAMP,
    reason VARCHAR(255),
    adminId INT REFERENCES Admin(adminId)
 );
CREATE TABLE Classes(
    classId SERIAL PRIMARY KEY,
    className VARCHAR(255),
    trainerId INT,
    roomId INT,    
    startTime TIMESTAMP,
    endTime TIMESTAMP,
    price DOUBLE PRECISION,
    maxcapacity INT,
    exerciseProgramid INT,
    groupClass BOOL,
    FOREIGN KEY (trainerId) REFERENCES Trainer(trainerId),
    FOREIGN KEY (roomId) REFERENCES Room(roomId),
    FOREIGN KEY (exerciseProgramid) REFERENCES ExerciseProgram(exerciseProgramid)
);
CREATE TABLE Bill (
    accountId SERIAL PRIMARY KEY,
    memberId INT REFERENCES Members(memberId),
    balance DOUBLE PRECISION
);
CREATE TABLE MemberRegistrations(
    registrationId  SERIAL PRIMARY KEY,
    memberId INT REFERENCES Members(memberId),   
    classId INT REFERENCES Classes(classId)
);
