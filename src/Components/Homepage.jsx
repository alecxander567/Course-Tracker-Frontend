import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import '../css/Homepage.css';
import axios from "axios";
import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Dev from '../assets/dev.webp';

function Homepage() {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [streak, setStreak] = useState(0);
    const [weekStreak, setWeekStreak] = useState(0);

    const [categories, setCategories] = useState({
        Programming: [],
        Networking: [],
        Security: [],
        Database: [],
        "IT Electives": []
    });

    const categoryIcons = {
        Programming: "bi bi-code-slash text-info",
        Networking: "bi bi-diagram-3 text-warning",
        Security: "bi bi-shield-lock text-info",
        Database: "bi bi-database text-danger",
        "IT Electives": "bi bi-puzzle"
    };

    const [editingId, setEditingId] = useState(null);

    const [inputs, setInputs] = useState({ subject: "", grade: "", category: "" });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        const defaultCategories = {
            Programming: [],
            Networking: [],
            Security: [],
            Database: [],
            "IT Electives": []
        };

        axios.get("http://localhost:8080/api/subjects")
            .then(res => {
            const data = res.data;

            const merged = { ...defaultCategories, ...data };

            setCategories(merged);
            })
            .catch(err => console.error(err));
    }, []);


    const handleAddSubject = (category) => {
        if (!inputs.subject || !inputs.grade) return;

        const newEntry = {
            subject: inputs.subject,
            grade: inputs.grade,
            category: category
        };

        axios.post("http://localhost:8080/api/subjects", newEntry)
            .then(res => {
                setCategories(prev => ({
                    ...prev,
                    [category]: [...(prev[category] || []), newEntry]
                }));
                setInputs({ subject: "", grade: "", category: "" });
            })
            .catch(err => console.error("Error saving subject:", err));
    };

    const handleEdit = (entry) => {
        setInputs({
            subject: entry.subject,
            grade: entry.grade,
            category: entry.category
        });
        setEditingId(entry.id);
    };

    const handleSaveEdit = () => {
        axios.put(`http://localhost:8080/api/subjects/${editingId}`, inputs)
            .then(res => {
                setCategories(prev => {
                    const updated = { ...prev };

                    const oldCategory = Object.keys(prev).find(cat =>
                        prev[cat].some(subject => subject.id === editingId)
                    );

                    if (oldCategory !== inputs.category) {
                        updated[oldCategory] = updated[oldCategory].filter(subject => subject.id !== editingId);

                        updated[inputs.category] = [...(updated[inputs.category] || []), res.data];
                    } else {
                        updated[inputs.category] = updated[inputs.category].map(subject =>
                            subject.id === editingId ? res.data : subject
                        );
                    }

                    return updated;
                });

                setInputs({ subject: "", grade: "", category: "" });
                setEditingId(null);
            })
            .catch(err => console.error("Error updating subject:", err));
    };


    const handleDelete = (id, category) => {
        axios.delete(`http://localhost:8080/api/subjects/${id}`)
            .then(() => {
                setCategories(prev => {
                    const updated = { ...prev };
                    updated[category] = updated[category].filter(item => item.id !== id);
                    return updated;
                });
            })
            .catch(err => console.error("Error deleting subject:", err));
    };

    const chartData = Object.keys(categories).map(category => {
        const grades = categories[category].map(entry => parseFloat(entry.grade));
        const average = grades.length > 0
            ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2)
            : 0;
        return { category, average: Number(average) };
    });

    const getAverageGrade = (entries) => {
        if (entries.length === 0) return 0;
        const sum = entries.reduce((acc, entry) => acc + parseFloat(entry.grade || 0), 0);
        return sum / entries.length;
    };

    const categoryAverages = Object.keys(categories).reduce((acc, category) => {
        acc[category] = getAverageGrade(categories[category]);
        return acc;
    }, {});

    const topCategory = Object.entries(categoryAverages).reduce(
        (best, [category, avg]) => (avg > best.avg ? { category, avg } : best),
        { category: '', avg: -Infinity }
        ).category;

    const careerSuggestions = {
        Programming: ["Software Developer", "Frontend Engineer", "Mobile App Developer"],
        Networking: ["Network Engineer", "System Administrator", "Cloud Network Specialist"],
        Security: ["Cybersecurity Analyst", "Penetration Tester", "Information Security Officer"],
        Database: ["Database Administrator", "Data Analyst", "BI Developer"],
        "IT Electives": ["Technical Support", "IT Project Coordinator", "QA Tester"]
    };

    const sortedCareerSuggestions = Object.entries(categoryAverages)
    .filter(([, avg]) => avg > 0) 
    .sort(([, avgA], [, avgB]) => avgB - avgA)
    .map(([category, avg]) => ({
        category,
        avg: avg.toFixed(2),
        suggestion: careerSuggestions[category]?.[0] || "No suggestion available"
    }));

   useEffect(() => {
    const userId = localStorage.getItem("userId") || "myUser123";

    axios.post(`http://localhost:8080/api/streak/${userId}`)
            .then(response => {
            const data = response.data;
            setStreak(data.currentStreak);
            setWeekStreak(data.weeklyStreak);
            localStorage.setItem("streak", data.currentStreak.toString());
            localStorage.setItem("weekStreak", data.weeklyStreak.toString());
            localStorage.setItem("lastVisit", new Date(data.lastVisit).toString());
        })
            .catch(error => {
            console.error("Failed to update streak:", error);
        });
    }, []);

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div className="d-flex flex-column flex-shrink-0 p-3 bg-primary text-white" 
                style={{
                        width: "250px",
                        height: "100vh",
                        position: "fixed",
                        top: 0,
                        left: 0,
                        zIndex: 1000
                    }}>
                <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <i className="bi bi-mortarboard me-2 fs-4"></i>
                    <span className="fs-4">Course Tracker</span>
                </a>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <Link to="/home" className="nav-link text-white">
                            <i className="bi bi-house-door me-2"></i>
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/courses" className="nav-link text-white">
                            <i className="bi bi-book me-2"></i>
                            My Courses
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile" className="nav-link text-white">
                            <i className="bi bi-person me-2"></i>
                            Profile
                        </Link>
                    </li>
                    <li>
                        <Link to="/settings" className="nav-link text-white">
                            <i className="bi bi-gear me-2"></i>
                            Settings
                        </Link>
                    </li>
                </ul>
                <hr />
                <div>
                    <button className="btn btn-danger w-100" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow-1" style={{ minHeight: "100vh", marginLeft: "250px" }}>
                {/* Header */}
                <header className="bg-primary py-2 px-4 border-bottom shadow-sm d-flex justify-content-between align-items-center">
                    <h2 className="mb-0 text-light" style={{ fontWeight: "900" }}>Dashboard</h2>
                    <div className="d-flex align-items-center gap-3">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-light">
                            <i className="bi bi-facebook fs-4"></i>
                        </a>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-light">
                            <i className="bi bi-github fs-4"></i>
                        </a>
                        <a href="https://reddit.com" target="_blank" rel="noopener noreferrer" className="text-light">
                            <i className="bi bi-reddit fs-4"></i>
                        </a>
                    </div>
                </header>

                <main className="p-4">
                    <div className="card mt-2" style={{ marginBottom: "30px" }}>
                       <div className="card-header bg-primary text-white d-flex align-items-center gap-2">
                            <i className="bi bi-bar-chart-fill"></i>
                            Category Performance Chart
                        </div>
                        <div className="card-body">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="category" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Bar dataKey="average" fill="skyblue" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    
                    <div className="d-flex gap-4 align-items-start">
                        {/* Left Side */}
                        <div className="d-flex flex-column gap-4 flex-grow-1" style={{ maxWidth: "500px" }}>
                            {Object.keys(categories).map((category) => (
                            <div className="card" key={category}>
                                <div className="card-header bg-primary text-white">
                                <i className={`${categoryIcons[category]} me-2`}></i>
                                {category}
                                </div>
                                <ul className="list-group list-group-flush">
                                {categories[category].map((entry, index) => (
                                    <li key={index} className="list-group-item d-flex flex-column gap-2">
                                    {editingId === entry.id ? (
                                        <>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="subject"
                                            value={inputs.subject}
                                            onChange={handleInputChange}
                                            placeholder="Subject"
                                        />
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="grade"
                                            value={inputs.grade}
                                            onChange={handleInputChange}
                                            placeholder="Grade"
                                        />
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-success btn-sm" onClick={() => handleSaveEdit(category)}>Save</button>
                                            <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                                        </div>
                                        </>
                                    ) : (
                                        <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <span>{entry.subject}</span> - <span className="fw-bold">{entry.grade}</span>
                                        </div>
                                        <div>
                                            <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(entry)}>
                                                <i class="bi bi-pencil-square"></i> 
                                            </button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(entry.id, category)}>
                                                <i class="bi bi-trash3-fill"></i>
                                            </button>
                                        </div>
                                        </div>
                                    )}
                                    </li>
                                ))}
                                <li className="list-group-item">
                                    <div className="d-flex gap-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="subject"
                                        value={inputs.subject}
                                        onChange={handleInputChange}
                                        placeholder="Subject"
                                    />
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="grade"
                                        value={inputs.grade}
                                        onChange={handleInputChange}
                                        placeholder="Grade"
                                        style={{ width: "80px" }}
                                    />
                                    <button className="btn btn-primary" onClick={() => handleAddSubject(category)}>Add</button>
                                    </div>
                                </li>
                                </ul>
                            </div>
                            ))}
                        </div>

                        {/* Right Side */}
                        <div className="d-flex flex-column gap-4" style={{ minWidth: "450px", maxWidth: "450px" }}>
                            {/* Career Suggestions */}
                            {sortedCareerSuggestions.length > 0 && (
                            <div className="card h-fit-content">
                                <div className="card-header bg-primary text-white">
                                <i className="bi bi-briefcase me-2"></i>
                                Career Path Suggestions
                                </div>
                                <ul className="list-group list-group-flush">
                                {sortedCareerSuggestions.map((item, idx) => (
                                    <li key={idx} className="list-group-item d-flex align-items-start">
                                    <i className="bi bi-arrow-right-circle-fill text-primary me-2 mt-1"></i>
                                    <div>
                                        <strong>{item.category} ({item.avg})</strong>: {item.suggestion}
                                    </div>
                                    </li>
                                ))}
                                </ul>
                            </div>
                            )}

                            {/* Calendar */}
                            <div className="card">
                            <div className="card-header bg-primary text-white d-flex align-items-center">
                                <i className="bi bi-calendar-event me-2"></i>
                                My Calendar
                            </div>
                            <div className="card-body d-flex flex-column align-items-center">
                                <Calendar onChange={setSelectedDate} value={selectedDate} />
                                <p className="mt-3 mb-0 text-center">
                                Selected Date: <strong>{selectedDate.toDateString()}</strong>
                                </p>
                            </div>
                            </div>

                            {/* Streak Card */}
                            {streak !== null && (
                            <div className="card text-center">
                                <div className="card-header bg-primary text-light d-flex align-items-center justify-content-center">
                                <i className="bi bi-fire me-2"></i>
                                    Your Streak
                                </div>
                                <div className="card-body">
                                <h5 className="mb-2">🔥 Current Streak: <strong>{streak} day{streak !== 1 ? "s" : ""}</strong></h5>
                                <p className="mb-0">This Week's Progress: <strong>{weekStreak}/7</strong></p>
                                 <img src={Dev} alt="Developer" width={250} height={256} />
                                </div>
                            </div>
                            )}
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}

export default Homepage;
