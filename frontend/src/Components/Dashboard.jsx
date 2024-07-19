import React, { useEffect, useState } from 'react'
import { backend_url } from './services';
import AttendanceChart from './AttendanceChart';
import UpcomingEvents from './UpcomingEvents';

const Dashboard = ({ userId }) => {

  const [userDetails, setUserDetails] = useState(null);

  // function to get user details by id
  const getUserDetails = async () => {
    try {
      const response = await fetch(`${backend_url}/getUserDetails/${userId}`);
      const data = await response.json();
      console.log("user details:", data);
      setUserDetails(data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, [])

  if (!userDetails) {
    return (
      <div class="d-flex justify-content-center align-items-center text-center" style={{ 'height': '90vh' }}>
        <div class="spinner-border" style={{ 'height': '3rem', 'width': '3rem' }} role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }


  return (
    <div className="container mt-5">
      <h2 className="mb-4">Your Past Attended Events</h2>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>id</th>
              <th>event name</th>
              <th>assigned to</th>
              <th>start date</th>
              <th>end date</th>
            </tr>
          </thead>
          <tbody>
            {userDetails.attendedEvents.map((event, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{event.eventName}</td>
                <td>{event.assignedTo.name}</td>
                <td>{new Date(event.startDate).toLocaleDateString()}</td>
                <td>{new Date(event.endDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="row mt-5">
        <div className="col-md-4">
          <h3 className="mb-4">Attendence Statistics</h3>
          <AttendanceChart userDetails={userDetails} />
        </div>
        <div className="col-md-8">
          <h3>Upcoming Events:</h3>
          {/* You can add upcoming events here if available */}
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
}

export default Dashboard      