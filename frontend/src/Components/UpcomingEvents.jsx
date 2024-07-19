import React, { useState } from 'react'
import { backend_url } from './services';
import { useEffect } from 'react';

const UpcomingEvents = () => {

    const [upcomingEvents, setUpcomingEvents] = useState([]);

    const getUpcomingEvents = async () => {
        try {
            const response = await fetch(`${backend_url}/upcomingEvents`);
            const data = await response.json();
            console.log("Upcoming Events:", data);
            setUpcomingEvents(data.data);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        getUpcomingEvents();
    },[])

    return (
        <div className="table-responsive">
            <table className="table table-striped" id="userTable">
                <thead>
                    <tr>
                        <th>Sno</th>
                        <th>Event Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Event Head</th>
                    </tr>
                </thead>
                <tbody id="tbody">
                    {upcomingEvents.map((event, index) => (
                        <tr key={index}>
                            <td>{  index + 1}</td>
                            <td>{event?.eventName}</td>
                            <td>{new Date(event.startDate).toLocaleDateString()}</td>
                            <td>{new Date(event.endDate).toLocaleDateString()}</td>
                            <td>{event?.assignedTo?.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}

export default UpcomingEvents