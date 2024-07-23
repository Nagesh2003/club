import React, { useEffect, useState } from "react";
import Navbar from './navbar.js'
import './upcomingmeet.css';

const UpcomingMeetings = () => {
    const [meetings, setMeetings] = useState([]);

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const response = await fetch('http://localhost:3000/get-meetings');
                if (response.ok) {
                    const data = await response.json();
                    setMeetings(data.data); // Adjust this based on your backend response structure
                } else {
                    console.error("Failed to fetch meetings");
                }
            } catch (error) {
                console.error("Error fetching meetings:", error);
            }
        };

        fetchMeetings();
    }, []);

    const handleJoinMeeting = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div>
            <Navbar />
            <h1 className="upcoming-header">Upcoming Meetings</h1>
            <ul className="meeting-list">
                {meetings.map((meeting) => (
                    <li key={meeting._id} className="meeting-item">
                        <p><strong>Start Time:</strong> {new Date(meeting.startTime).toLocaleString()}</p>
                        <p><strong>End Time:</strong> {new Date(meeting.endTime).toLocaleString()}</p>
                        <p><strong>Description:</strong> {meeting.description}</p>
                        <button className="join-button" onClick={() => handleJoinMeeting(meeting.url)}>Join Meeting</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UpcomingMeetings;
