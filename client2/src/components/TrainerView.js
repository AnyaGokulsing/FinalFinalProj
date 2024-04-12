import React, { Fragment, useState, useEffect } from "react";
const TrainerView = () => {
  // State variables for adding availability
  const [addStartTime, setAddStartTime] = useState("");
  const [addEndTime, setAddEndTime] = useState("");
  const [availableTrainers, setAvailableTrainers] = useState([]);

  // State variables for finding available trainers
  const [findStartTime, setFindStartTime] = useState("");
  const [findEndTime, setFindEndTime] = useState("");
  const [memberDetails, setMemberDetails] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Function to fetch available trainers based on start time and end time
  const fetchAvailableTrainers = async (startTime, endTime) => {
    try {
      const response = await fetch(`http://localhost:5000/trainers/available/${startTime}/${endTime}`);
      if (!response.ok) {
        throw new Error("Failed to fetch available trainers");
      }
      const data = await response.json();
      setAvailableTrainers(data);
      console.log(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Function to handle getting available trainers
  const handleGetAvailableTrainers = async () => {
    if (findEndTime > findStartTime) { // Check if end time is greater than start time
      await fetchAvailableTrainers(findStartTime, findEndTime);
    } else {
      console.error("End time should be greater than start time");
    }
  };

  // Function to handle finding a member
  const handleFindMember = async () => {
    if (firstName && lastName) { // Check if first name and last name fields are not empty
      try {
        const response = await fetch(`http://localhost:5000/trainers/member/${firstName}/${lastName}`);
        if (!response.ok) {
          throw new Error("Failed to find member");
        }
        const data = await response.json();
        setMemberDetails(data);
        console.log(data);
      } catch (error) {
        console.error(error.message);
      }
    } else {
      console.error("First name and last name are required");
    }
  };

  // Function to handle adding availability
  const handleAddAvailability = async () => {
    if (addEndTime > addStartTime) { // Check if end time is greater than start time
      try {
        const response = await fetch("http://localhost:5000/trainers/availability", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ startTime: addStartTime, endTime: addEndTime, trainerId: 1 }), // Assuming trainerId=1
        });
        if (!response.ok) {
          throw new Error("Failed to add availability");
        }
        await fetchAvailableTrainers(addStartTime, addEndTime); // Refresh available trainers after adding availability
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error.message);
      }
    } else {
      console.error("End time should be greater than start time");
    }
  };

  // Fetch available trainers on component mount
  useEffect(() => {
    fetchAvailableTrainers(findStartTime, findEndTime);
  }, []);

  // Function to check if the search button for finding a member should be disabled
  const isSearchButtonDisabled = () => {
    return !firstName || !lastName;
  };

  return (
    <Fragment>
      <h1 className="text-left mt-5">
        <span className="badge rounded-pill bg-info">'</span>&nbsp;Trainer View
      </h1>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6">
            <h2>Add Availability</h2>
            <div className="form-group">
              <label htmlFor="addStartTime">Start Time:</label>
              <input
                type="datetime-local"
                className="form-control"
                id="addStartTime"
                value={addStartTime}
                onChange={(e) => setAddStartTime(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="addEndTime">End Time:</label>
              <input
                type="datetime-local"
                className="form-control"
                id="addEndTime"
                value={addEndTime}
                onChange={(e) => setAddEndTime(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={handleAddAvailability}>
              Add Availability
            </button>
          </div>
          <div className="col-md-6">
            <h2>Find Available Trainers</h2>
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
          </div>
        </div>
      </div>
       <div className="mt-4">
        <h2>Available Trainers</h2>
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
              </tr>
            </thead>
            <tbody>
              {availableTrainers.map((trainer) => (
                <tr key={`trainer-${trainer.availabilityid}`}>
                  <td>{new Date(trainer.starttime).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{new Date(trainer.endtime).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{trainer.firstname}</td>
                  <td>{trainer.lastname}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <form className="mt-5">
        <h2>Find Member</h2>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Enter First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Enter Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <button type="button" className="btn btn-primary" onClick={handleFindMember} disabled={isSearchButtonDisabled()}>
          Find Member
        </button>
      </form>
      <div className="mt-5">
      <h3>Member Details</h3>
        {memberDetails.length === 0 ? (
          <p>No member details found</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Programme Name</th>
              </tr>
            </thead>
            <tbody>
              {memberDetails.map((member) => (
                <tr key={`member-${member.memberid}`}>
                  <td>{member.firstname}</td>
                  <td>{member.lastname}</td>
                  <td>{member.exerciseprogramname}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Fragment>
  );
};

export default TrainerView;
