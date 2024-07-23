import React, { useState } from "react";
import Navbar from './navbar';
import './shedule.css';

const ScheduleForm = () => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const meeting = {
            startTime,
            endTime,
            description,
            url
        };

        const response = await fetch("http://localhost:3000/schedule-meeting", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(meeting)
        });

        if (response.ok) {
            console.log("Successfully scheduled meeting");
            setStartTime('');
            setEndTime('');
            setDescription('');
            setUrl('');
        } else {
            alert("Failed to schedule a meeting");
        }
       
    };

    return (
        <div>
            <Navbar />
            <div className="schedule">
                <h2>Schedule a Meeting</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Start Time:
                        <input
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        End Time:
                        <input
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Description:
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Zoom URL:
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                        />
                    </label>
                    <br />
                    <button type="submit">Schedule</button>
                </form>
            </div>
        </div>
    );
};

export default ScheduleForm;
