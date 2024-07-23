import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaUpload, FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';
import Navbar from './navbar';

import './activity.css';

const Activities = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [file, setFile] = useState(null);
    const [allFiles, setAllFiles] = useState([]);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const optionsRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get("http://localhost:3000/get-files");
                setAllFiles(result.data.data);
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setSelectedFile(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const submitFile = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("date", date);
        if (file) {
            formData.append("file", file);
        }

        try {
            if (editMode && editId) {
                await axios.put(`http://localhost:3000/update-file/${editId}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
            } else {
                await axios.post("http://localhost:3000/upload-files", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
            }

            const result = await axios.get("http://localhost:3000/get-files");
            setAllFiles(result.data.data);

            setTitle('');
            setDescription('');
            setDate('');
            setFile(null);
            setShowUploadForm(false);
            setEditMode(false);
            setEditId(null);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const deleteFile = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/delete-file/${id}`);
            // Manually update the state to remove the deleted file
            setAllFiles(allFiles.filter(file => file._id !== id));
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const editFile = (file) => {
        setEditMode(true);
        setEditId(file._id);
        setTitle(file.title);
        setDescription(file.description);
        setDate(file.date);
        setShowUploadForm(true);
    };

    const openOptions = (file) => {
        setSelectedFile(file);
    };

    const closeOptions = () => {
        setSelectedFile(null);
    };

    const toggleUploadForm = () => {
        setShowUploadForm(!showUploadForm);
        setTitle('');
        setDescription('');
        setDate('');
        setFile(null);
        setEditMode(false);
        setEditId(null);
    };

    return (
        <div className='activity-container'>
            <Navbar />
            <div className="content">
                <div className="timeline-description">
                    <h2>Club Activities</h2>
                    <p>This below series shows activities done by our FLY CLUB</p>
                </div>
                <div className="floating-btn" onClick={toggleUploadForm}>
                    <FaUpload className="upload-icon" />
                    <span>Upload</span>
                </div>
                {showUploadForm ? (
                    <form className="upload-form" onSubmit={submitFile}>
                        <h3>{editMode ? 'Edit PDF File' : 'Upload PDF File'}</h3>
                        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                        <button type="submit"><FaUpload className="upload-icon" /> {editMode ? 'Update' : 'Upload'}</button>
                        <button type="button" onClick={toggleUploadForm}>Cancel</button>
                    </form>
                ) : (
                    <ul className="timeline">
                        {allFiles.map((file, index) => (
                            <li className="timeline-item" key={index}>
                                <div className="timeline-content">
                                    <h3>{file.title}</h3>
                                    <p>{file.description}</p>
                                    <p>Uploaded on: {file.date}</p>
                                    <a href={`http://localhost:3000/files/${file.pdf}`} target="_blank" rel="noopener noreferrer">View PDF</a>
                                    <FaEllipsisV className="ellipsis-icon" onClick={() => openOptions(file)} />
                                    <div ref={optionsRef} className={`options ${selectedFile === file ? 'active' : ''}`}>
                                        <span onClick={() => editFile(file)}><FaEdit /> Edit</span>
                                        <span onClick={() => deleteFile(file._id)}><FaTrash /> Delete</span>
                                        <span onClick={closeOptions}>Close</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Activities;
