import React, { Fragment, useState, useEffect } from 'react';

const MemberView = () => {
  const [memberClasses, setMemberClasses] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [selectedDatetime, setSelectedDatetime] = useState('');
  const [memberId, setMemberId] = useState(1); // Member ID
  const [memberBalance, setMemberBalance] = useState(0);
  const [availableTrainers, setAvailableTrainers] = useState([]);
  const [findStartTime, setFindStartTime] = useState('');
  const [findEndTime, setFindEndTime] = useState('');
  const [healthStatistics, setHealthStatistics] = useState({});
  const [fitnessAchievements, setFitnessAchievements] = useState([]);
  const [exerciseProgram, setExerciseProgram] = useState([]);
  const [userDetails, setUserDetails] = useState({}); // State to hold user details
  const [editedDetails, setEditedDetails] = useState({});
  const [editedWeight, setEditedWeight] = useState('');
  const [editedHeight, setEditedHeight] = useState('');

  useEffect(() => {
    fetchMemberData();
  }, []);

  const fetchMemberData = async () => {
    try {
      await Promise.all([
        fetchMemberClasses(),
        fetchMemberBalance(),
        fetchHealthStatistics(),
        fetchFitnessAchievements(),
        fetchExerciseProgram(),
        fetchUserDetails(),
      ]);
    } catch (error) {
      console.error('Error fetching member data:', error.message);
    }
  };

  const fetchMemberClasses = async () => {
    try {
      const response = await fetch(`http://localhost:5000/members/${memberId}/classes`);
      if (response.ok) {
        const classesData = await response.json();
        setMemberClasses(classesData);
      } else {
        console.error('Failed to fetch member classes');
      }
    } catch (error) {
      console.error('Error fetching member classes:', error.message);
    }
  };

  const fetchMemberBalance = async () => {
    try {
      const response = await fetch(`http://localhost:5000/members/${memberId}/balance`);
      if (response.ok) {
        const balanceData = await response.json();
        setMemberBalance(balanceData.balance);
      } else {
        console.error('Failed to fetch member balance');
      }
    } catch (error) {
      console.error('Error fetching member balance:', error.message);
    }
  };

  const fetchHealthStatistics = async () => {
    try {
      const response = await fetch(`http://localhost:5000/members/${memberId}/healthStatistics`);
      if (response.ok) {
        const healthStats = await response.json();
        setHealthStatistics(healthStats);
        // Initialize editedWeight and editedHeight with fetched values
        setEditedWeight(healthStats.weight.toString());
        setEditedHeight(healthStats.height.toString());
      } else {
        console.error('Failed to fetch health statistics');
      }
    } catch (error) {
      console.error('Error fetching health statistics:', error.message);
    }
  };

  const fetchFitnessAchievements = async () => {
    try {
      const response = await fetch(`http://localhost:5000/members/${memberId}/fitnessAchievements`);
      if (response.ok) {
        const achievements = await response.json();
        setFitnessAchievements(achievements);
        console.log("Fitness achievements");
        console.log(fitnessAchievements);
      } else {
        console.error('Failed to fetch fitness achievements');
      }
    } catch (error) {
      console.error('Error fetching fitness achievements:', error.message);
    }
  };
  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/members/${memberId}`);
      if (response.ok) {
        const userDetailsData = await response.json();
        setUserDetails(userDetailsData);
        setEditedDetails({ ...userDetailsData }); // Initialize editedDetails with fetched user details
      } else {
        console.error('Failed to fetch user details');
      }
    } catch (error) {
      console.error('Error fetching user details:', error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
    if (name === 'editedWeight') {
      setEditedWeight(value);
    } else if (name === 'editedHeight') {
      setEditedHeight(value);
    }
  };
  const handleUpdateHealthStats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/members/${memberId}/healthStatistics`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weight: parseFloat(editedWeight),
          height: parseFloat(editedHeight),
        }),
      });

      if (response.ok) {
        console.log('Health statistics updated successfully');
        fetchHealthStatistics(); // Refresh health statistics after update
     // Fetch the updated user details after successful update
       fetchUserDetails(); // Assuming fetchUserDetails updates userDetails state

     
      } else {
        console.error('Failed to update health statistics');
      }
    } catch (error) {
      console.error('Error updating health statistics:', error.message);
    }
  };

  const handleUpdateDetails = async () => {
    const { firstName, lastName, phoneNum, address, emailAddress } = editedDetails;
    try {
      const response = await fetch(`http://localhost:5000/members/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phoneNum,
          address,
          emailAddress,
        }),
      });

      if (response.ok) {
        console.log('Member details updated successfully');
        fetchUserDetails(); // Refresh user details after update
      } else {
        console.error('Failed to update member details');
      }
    } catch (error) {
      console.error('Error updating member details:', error.message);
    }
  };

  const fetchExerciseProgram = async () => {
    try {
      const response = await fetch(`http://localhost:5000/members/${memberId}/exerciseProgram`);
      if (response.ok) {
        const program = await response.json();
        console.log("Exercise program");
        console.log(program);
        setExerciseProgram(program); // Assuming 'exerciseProgramName' is a field in the ExerciseProgram table
      } else {
        console.error('Failed to fetch exercise program');
      }
    } catch (error) {
      console.error('Error fetching exercise program:', error.message);
    }
  };

  const handleRefreshBalance = async () => {
    await fetchMemberBalance();
  };

  const handleFetchAvailableClasses = async () => {
    if (!selectedDatetime) {
      alert('Please select a datetime to search for available classes.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/classes?datetime=${selectedDatetime}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableClasses(data);
      } else {
        console.error('Failed to fetch available classes');
      }
    } catch (error) {
      console.error('Error fetching available classes:', error.message);
    }
  };

  const handleRegisterPersoClass = async (trainerId, availabilityId, startTime, endTime) => {
    try {
      const response = await fetch(`http://localhost:5000/members/${memberId}/personalTraining`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trainerId,
          availabilityId,
          roomId: 1,
          startTime,
          endTime,
          className: 'Personal Class Test',
          price: 50.00,
          maxCapacity: 1,
          exerciseProgramId: 1,
        }),
      });
      if (response.ok) {
        console.log('Registered for personal training session successfully');
        await fetchMemberClasses();
        await fetchAvailableTrainers(findStartTime, findEndTime);
        await fetchMemberBalance();
      } else {
        console.error('Failed to register for personal training session');
      }
    } catch (error) {
      console.error('Error registering for personal training session:', error.message);
    }
  };

  const handleRegisterClass = async (classId) => {
    try {
      const response = await fetch(`http://localhost:5000/members/${memberId}/groupClass/${classId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Class registered successfully');
        await fetchMemberClasses();
        await fetchMemberBalance();
      } else {
        console.error('Failed to register for class');
      }
    } catch (error) {
      console.error('Error registering for class:', error.message);
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
      const response = await fetch(`http://localhost:5000/members/${memberId}/classes/${classId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Class deleted successfully');
        await fetchMemberClasses();
        await fetchMemberBalance();
      } else {
        console.error('Failed to delete class');
      }
    } catch (error) {
      console.error('Error deleting class:', error.message);
    }
  };

  const handleGetAvailableTrainers = async () => {
    if (findEndTime > findStartTime) {
      await fetchAvailableTrainers(findStartTime, findEndTime);
    } else {
      console.error('End time should be greater than start time');
    }
  };

  const fetchAvailableTrainers = async (startTime, endTime) => {
    try {
      const response = await fetch(`http://localhost:5000/trainers/available/${startTime}/${endTime}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableTrainers(data);
      } else {
        console.error('Failed to fetch available trainers');
      }
    } catch (error) {
      console.error('Error fetching available trainers:', error.message);
    }
  };

  return (
    <Fragment>
      <h1 className="text-left mt-5">
        <span className="badge rounded-pill bg-primary">'</span>&nbsp;Member View
      </h1>
      <div className="container mt-5">
      <div className="mb-4">
      <div className="mb-4">
  {/* Health Statistics Section */}
      <div className="mb-4">
        <h2>Health Statistics</h2>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th scope="row">Weight (kg)</th>
              <td>
                <input
                  type="text"
                  name="editedWeight"
                  value={editedWeight}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <th scope="row">Height (cm)</th>
              <td>
                <input
                  type="text"
                  name="editedHeight"
                  value={editedHeight}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <th scope="row">BMI</th>
              <td>
                {(
                  10000 * (healthStatistics.weight / (healthStatistics.height * healthStatistics.height))
                ).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
        <button className="btn btn-primary" onClick={handleUpdateHealthStats}>
          Update Health Statistics
        </button>
      </div>
</div>
</div>
{/* Display Personal Details */}
<div className="mb-4">
          <h2>Personal Details</h2>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th scope="row">First Name</th>
                <td>
                  <input
                    type="text"
                    name="firstName"
                    value={editedDetails.firstName ||  userDetails.firstname}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">Last Name</th>
                <td>
                  <input
                    type="text"
                    name="lastName"
                    value={editedDetails.lastName ||  userDetails.lastname}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">Phone Number</th>
                <td>
                  <input
                    type="text"
                    name="phoneNum"
                    value={editedDetails.phoneNum ||  userDetails.phonenum}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">Address</th>
                <td>
                  <input
                    type="text"
                    name="address"
                    value={editedDetails.address || userDetails.address}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">Email Address</th>
                <td>
                  <input
                    type="text"
                    name="emailaddress"
                    value={editedDetails.emailaddress || userDetails.emailaddress}
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <button className="btn btn-primary" onClick={handleUpdateDetails}>
            Update Details
          </button>
        </div>
        {/* Display Exercise Program */}
<div className="mb-4">
  <h2>Exercise Program</h2>
  <table className="table table-bordered">
    <tbody>
      <tr>
        <th scope="row">Exercise Program ID</th>
        <td>{exerciseProgram.exerciseprogramid}</td>
      </tr>
      <tr>
        <th scope="row">Exercise Program Name</th>
        <td>{exerciseProgram.exerciseprogramname}</td>
      </tr>
      <tr>
        <th scope="row">Reps</th>
        <td>{exerciseProgram.rep}</td>
      </tr>
      <tr>
        <th scope="row">Sets</th>
        <td>{exerciseProgram.set}</td>
      </tr>
      <tr>
        <th scope="row">Time</th>
        <td>{exerciseProgram.time}</td>
      </tr>
      <tr>
        <th scope="row">Flexibility</th>
        <td>{exerciseProgram.flexibility}</td>
      </tr>
      <tr>
        <th scope="row">Strength</th>
        <td>{exerciseProgram.strength}</td>
      </tr>
      <tr>
        <th scope="row">Cardio</th>
        <td>{exerciseProgram.cardio}</td>
      </tr>
    </tbody>
  </table>
</div>


     {/* Display Fitness Achievements */}
<div className="mb-4">
  <h2>Fitness Achievements</h2>
  {fitnessAchievements.length > 0 ? (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Achievement ID</th>
          <th>Steps</th>
          <th>Heart Rate</th>
          <th>Time to Complete</th>
          <th>Personal Flexibility</th>
          <th>Personal Strength</th>
          <th>Personal Cardio</th>
        </tr>
      </thead>
      <tbody>
        {fitnessAchievements.map((achievement) => (
          <tr key={`achievement-${achievement.achievementid}`}>
            <td>{achievement.achievementid}</td>
            <td>{achievement.steps}</td>
            <td>{achievement.heartrate}</td>
            <td>{achievement.timetocomplete}</td>
            <td>{achievement.persoflexibility}</td>
            <td>{achievement.persostrength}</td>
            <td>{achievement.persocardio}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No fitness achievements found</p>
  )}
</div>


        {/* Member Balance Display */}
        <div className="mb-4">
          <h3>Member Balance: ${memberBalance}</h3>
          <button className="btn btn-primary" onClick={handleRefreshBalance}>
            Refresh Balance
          </button>
        </div>

        {/* Section to Find Available Classes */}
        <div className="mb-4">
          <h2>Find Available Classes</h2>
          <div className="row">
            <div className="col-md-6">
              {/* Datetime Picker */}
              <input
                type="datetime-local"
                className="form-control mb-3"
                value={selectedDatetime}
                onChange={(e) => setSelectedDatetime(e.target.value)}
              />
              {/* Button to Fetch Available Classes */}
              <button className="btn btn-primary" onClick={handleFetchAvailableClasses} disabled={!selectedDatetime}>
                Find Classes
              </button>
            </div>
          </div>
        </div>

        {/* Section to Display Available Classes */}
        {availableClasses.length > 0 && (
          <div className="mt-5">
            <h2>Available Classes</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Class ID</th>
                  <th>Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Trainer ID</th>
                  <th>Capacity</th>
                  <th>Room ID</th>
                  <th>Price</th>
                  <th>Group?</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {availableClasses.map((aclass) => (
                  <tr key={`available-class-${aclass.classid}`}>
                    <td>{aclass.classid}</td>
                    <td>{new Date(aclass.starttime).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                    <td>{new Date(aclass.starttime).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{new Date(aclass.endtime).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{aclass.trainerid}</td>
                    <td>{aclass.currentcapacity}</td>
                    <td>{aclass.roomid}</td>
                    <td>${aclass.price.toFixed(2)}</td>
                    <td>{aclass.groupclass ? 'Yes' : 'No'}</td>
                    <td>
                      <button className="btn btn-success" onClick={() => handleRegisterClass(aclass.classid)} disabled={aclass.currentcapacity >= aclass.maxcapacity}>
                        Register
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Section to Display Registered Classes */}
        <div className="mt-5">
          <h2>Registered Classes</h2>
          {memberClasses.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Class ID</th>
                  <th>Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Trainer ID</th>
                  <th>Room ID</th>
                  <th>Capacity</th>
                  <th>Group? </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {memberClasses.map((aclass) => (
                  <tr key={`registered-class-${aclass.classid}`}>
                    <td>{aclass.classid}</td>
                    <td>{new Date(aclass.starttime).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                    <td>{new Date(aclass.starttime).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{new Date(aclass.endtime).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{aclass.trainerid}</td>
                    <td>{aclass.roomid}</td>
                    <td>{aclass.currentcapacity}</td>
                    <td>{aclass.groupclass ? 'Yes' : 'No'}</td>
                    <td>
                      <button className="btn btn-danger" onClick={() => handleDeleteClass(aclass.classid)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No registered classes found</p>
          )}
        </div>

        {/* Section to Display Available Trainers */}
        <div className="mt-5">
          <h2>Available Trainers</h2>
          <div className="form-group">
            <label htmlFor="findStartTime">Start Time:</label>
            <input
              type="datetime-local"
              className="form-control"
              id="findStartTime"
              value={findStartTime}
              onChange={(e) => setFindStartTime(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="findEndTime">End Time:</label>
            <input
              type="datetime-local"
              className="form-control"
              id="findEndTime"
              value={findEndTime}
              onChange={(e) => setFindEndTime(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleGetAvailableTrainers}>
            Find Available Trainers
          </button>
          {availableTrainers.length === 0 ? (
            <p>No available trainers found</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Start Time</th>
                  <th scope="col">End Time</th>
                  <th scope="col">First Name</th>
                  <th scope="col">Last Name</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {availableTrainers.map((trainer) => (
                  <tr key={`trainer-${trainer.availabilityid}`}>
                    <td>{new Date(trainer.starttime).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{new Date(trainer.endtime).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{trainer.firstname}</td>
                    <td>{trainer.lastname}</td>
                    <td>
                      <button className="btn btn-success" onClick={() => handleRegisterPersoClass(trainer.trainerid, trainer.availabilityid, trainer.starttime, trainer.endtime)}>
                        Register
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default MemberView;
