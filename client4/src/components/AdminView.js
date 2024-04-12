import React, { Fragment, useState, useEffect } from "react";

const AdminView = () => {
  // State variables
  const [roomBookingData, setRoomBookingData] = useState({
    roomId: "",
    startTime: "",
    endTime: "",
    reason: "",
    adminId: "",
  });
  const [newClassData, setNewClassData] = useState({
    startTime: "",
    endTime: "",
    className: "",
    trainerId: "",
    maxcapacity: "",
    isGroupClass: true,
    price: "",
    roomId: "",
  });
  const [bookingHistory, setBookingHistory] = useState([]);
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  const [searchRoomId, setSearchRoomId] = useState("");
  const [searchEquipmentId, setSearchEquipmentId] = useState("");
  const [accountId, setAccountId] = useState(""); // State for accountId
  const [billBalance, setBillBalance] = useState(null); // State for member's bill balance
  const [selectedDatetime, setSelectedDatetime] = useState("");
  const [classes, setClasses] = useState([]);

  // Function to handle room booking
  const handleRoomBooking = async () => {
    try {
      const response = await fetch("http://localhost:5000/admin/roomBooking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomBookingData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Room booking added successfully:", data);
        // Reset roomBookingData state after successful booking
        setRoomBookingData({
          roomId: "",
          trainerId: "",
          startTime: "",
          endTime: "",
          reason: "",
          adminId: "",
        });
      } else {
        const errorData = await response.json();
        alert(`Failed to add room booking: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error adding room booking:", error.message);
      alert("Error adding room booking. Please try again.");
    }
  };
  
  // Function to fetch booking history for a room based on room ID
  const fetchBookingHistory = async (roomId) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/roomBooking/history/${roomId}`);
      const data = await response.json();
      setBookingHistory(data);
    } catch (error) {
      console.error("Error fetching booking history:", error.message);
    }
  };

  // Function to fetch maintenance history for equipment based on equipment ID
  const fetchMaintenanceHistory = async (equipmentId) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/equipmentMaintenance/history/${equipmentId}`);
      const data = await response.json();
      setMaintenanceHistory(data);
    } catch (error) {
      console.error("Error fetching equipment maintenance history:", error.message);
    }
  };

  // Function to handle search based on room ID
  const handleSearch = () => {
    if (searchRoomId.trim() !== "") {
      fetchBookingHistory(searchRoomId.trim());
    } else {
      alert("Please enter a valid Room ID.");
    }
  };

  // Function to handle search based on equipment ID
  const handleEquipmentSearch = () => {
    if (searchEquipmentId.trim() !== "") {
      fetchMaintenanceHistory(searchEquipmentId.trim());
    } else {
      alert("Please enter a valid Equipment ID.");
    }
  };
  // Function to handle paying a bill for a specific account ID
const handlePayBill = async () => {
    try {
      const response = await fetch(`http://localhost:5000/payBill/${accountId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Bill paid successfully:", data);
        // Reset accountId state after successful payment
        setAccountId("");
        // Update bill balance state with the new balance received
        setBillBalance(data); // Assuming `data.balance` contains the updated balance
       // billBalance = data;
      } else {
        const errorData = await response.json();
        alert(`Failed to pay bill: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error paying bill:", error.message);
      alert("Error paying bill. Please try again.");
    }
  };
  
  const handleFetchClasses = async () => {
    try {
      const response = await fetch(`http://localhost:5000/classes?datetime=${selectedDatetime}`);
      const data = await response.json();
      setClasses(data);
      console.log("Fetching classes ");
      console.log(data);
    } catch (error) {
      console.error("Error fetching classes:", error.message);
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/classes/${classId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        // Refetch classes after deletion
        handleFetchClasses();
        console.log("Class deleted successfully");
      } else {
        const errorData = await response.json();
        console.error(`Failed to delete class: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting class:", error.message);
    }
  };
  //adding a class
  const handleAddClass = async () => {
    try {
      const response = await fetch("http://localhost:5000/admin/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newClassData),   
      });
      
      if (response.ok) {
        const classData = await response.json();
        console.log("Class added successfully:", classData);
        
        // Now book a room for this class
        const roomBookingData = {
          roomId: newClassData.roomId,
          startTime: newClassData.startTime,
          endTime: newClassData.endTime,
          className : newClassData.className,
          reason: `Booking for ${newClassData.className}`, // Customize reason as needed
          adminId: 1,
        };
  
        const roomBookingResponse = await fetch("http://localhost:5000/admin/roomBooking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(roomBookingData),
        });
  
        if (roomBookingResponse.ok) {
          console.log("Room booked successfully for the class.");
        } else {
          const roomBookingErrorData = await roomBookingResponse.json();
          console.error("Failed to book room for the class:", roomBookingErrorData.error);
        }
        
        // Clear form after adding class and booking room
        setNewClassData({
          startTime: "",
          endTime: "",
          className:"",
          trainerId: "",
          maxcapacity: "",
          price: "",
          roomId: "",
        });
      } else {
        const errorData = await response.json();
        alert(`Failed to add class: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error adding class:", error.message);
      alert("Error adding class. Please try again.");
    }
  };
  

  return (
    <Fragment>
      <h1 className="text-left mt-5">
        <span className="badge rounded-pill bg-warning">'</span>&nbsp;Admin View
      </h1>
       {/* Form to add a new class */}
       <div className="container mt-5">
        <h2>Add New Group Class</h2>
        <div className="row">
          <div className="col-md-6">
            <input
              type="datetime-local"
              className="form-control mb-3"
              placeholder="Start Time"
              value={newClassData.startTime.toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
              onChange={(e) =>
                setNewClassData({ ...newClassData, startTime: e.target.value })
              }
            />
            <input
              type="datetime-local"
              className="form-control mb-3"
              placeholder="End Time"
              value={newClassData.endTime.toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
              onChange={(e) =>
                setNewClassData({ ...newClassData, endTime: e.target.value })
              }
            />
             <input
              type="text"
              className="form-control mb-3"
              placeholder="Class Name"
              value={newClassData.className}
              onChange={(e) =>
                setNewClassData({ ...newClassData, className: e.target.value })
              }
            />
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Trainer ID"
              value={newClassData.trainerId}
              onChange={(e) =>
                setNewClassData({ ...newClassData, trainerId: e.target.value })
              }
            />
            <input
              type="number"
              className="form-control mb-3"
              placeholder="Max Capacity"
              value={newClassData.maxcapacity}
              onChange={(e) =>
                setNewClassData({ ...newClassData, maxcapacity: e.target.value })
              }
            />
            <input
              type="number"
              step="0.01"
              className="form-control mb-3"
              placeholder="Price"
              value={newClassData.price}
              onChange={(e) =>
                setNewClassData({ ...newClassData, price: e.target.value })
              }
            />
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Room ID"
              value={newClassData.roomId}
              onChange={(e) =>
                setNewClassData({ ...newClassData, roomId: e.target.value })
              }
            />
            <button className="btn btn-primary" onClick={handleAddClass}>
              Add Class
            </button>
          </div>
        </div>
      </div>
      <div className="container mt-5">
        <h2>Fetch Classes by Datetime</h2>
        <div className="row">
          <div className="col-md-6">
            {/* Datetime Picker */}
            <input
              type="datetime-local"
              className="form-control mb-3"
              value={selectedDatetime}
              onChange={(e) => setSelectedDatetime(e.target.value)}
            />
            {/* Button to Fetch Classes */}
            <button className="btn btn-primary" onClick={handleFetchClasses}>
              Fetch Classes
            </button>
          </div>
        </div>
        {/* Display Table of Classes */}
        {classes.length > 0 && (
          <div className="mt-5">
            <h2>Classes</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Class ID</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Trainer ID</th>
                  <th>Room ID</th>
                  <th>Action</th> {/* New column for delete button */}
                </tr>
              </thead>
              <tbody>
                {classes.map((aclass) => (
                  <tr key={`classes-${aclass.classid}`}>
                    <td>{aclass.classid}</td>
                    <td>{new Date(aclass.starttime).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{new Date(aclass.endtime).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{aclass.trainerid}</td>
                    <td>{aclass.roomid}</td>
                    <td>
                      {/* Delete button with onClick handler */}
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteClass(aclass.classid)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="container mt-5">
        <h2>Room Booking Management</h2>
        <div className="row">
          <div className="col-md-6">
            {/* Input fields for room booking */}
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Room ID"
              value={roomBookingData.roomId}
              onChange={(e) => setRoomBookingData({ ...roomBookingData, roomId: e.target.value })}
            />
            <input
              type="datetime-local"
              className="form-control mb-3"
              placeholder="Start Time"
              value={roomBookingData.startTime}
              onChange={(e) => setRoomBookingData({ ...roomBookingData, startTime: e.target.value })}
            />
            <input
              type="datetime-local"
              className="form-control mb-3"
              placeholder="End Time"
              value={roomBookingData.endTime}
              onChange={(e) => setRoomBookingData({ ...roomBookingData, endTime: e.target.value })}
            />
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Reason"
              value={roomBookingData.reason}
              onChange={(e) => setRoomBookingData({ ...roomBookingData, reason: e.target.value })}
            />
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Admin ID"
              value={roomBookingData.adminId}
              onChange={(e) => setRoomBookingData({ ...roomBookingData, adminId: e.target.value })}
            />
            <button className="btn btn-primary" onClick={handleRoomBooking}>
              Add Room Booking
            </button>
          </div>
        </div>
        {/* Search Booking History by Room ID */}
        <div className="mt-5">
          <h2>Search Booking History by Room ID</h2>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Room ID"
              value={searchRoomId}
              onChange={(e) => setSearchRoomId(e.target.value)}
            />
            <button className="btn btn-primary" type="button" onClick={handleSearch}>
              Search
            </button>
          </div>
          {/* Display table for booking history */}
          {bookingHistory.length > 0 && (
            <table className="table">
              <thead>
                <tr>
                  <th>Booking Time</th>
                  <th>Reason</th>
                  <th>Admin ID</th>
                </tr>
              </thead>
              <tbody>
                {bookingHistory.map((booking) => (
                  <tr key={`booking-${booking.bookingid}`}>
                    <td>{new Date(booking.bookingtime).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{booking.reason}</td>
                    <td>{booking.adminid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Search Maintenance History by Equipment ID */}
        <div className="mt-5">
          <h2>Search Maintenance History by Equipment ID</h2>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Equipment ID"
              value={searchEquipmentId}
              onChange={(e) => setSearchEquipmentId(e.target.value)}
            />
            <button className="btn btn-primary" type="button" onClick={handleEquipmentSearch}>
              Search
            </button>
          </div>
          {/* Display table for maintenance history */}
          {maintenanceHistory.length > 0 && (
            <table className="table">
              <thead>
                <tr>
                  <th>Request Time</th>
                  <th>Reason</th>
                  <th>Admin ID</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceHistory.map((maintenance) => (
                  <tr key={`maintenance-${maintenance.maintenanceid}`}>
                    <td>{new Date(maintenance.requesttime).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{maintenance.reason}</td>
                    <td>{maintenance.adminid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <br></br>
        </div>
          <h2>Pay Bill for Account</h2>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Account ID"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handlePayBill}>
              Pay Bill
            </button>
            {billBalance !== null && (
            <table className="table">
              <thead>
                <tr>
                  <th>Account ID</th>
                  <th>Member ID</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {billBalance.map((bill) => (
                  <tr key={`bill-${bill.accountid}`}>
                    <td>{bill.accountid}</td>
                    <td>{bill.memberid}</td>
                    <td>{bill.balance}</td>
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

export default AdminView;
