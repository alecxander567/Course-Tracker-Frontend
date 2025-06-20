import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import '../css/Homepage.css';
import axios from "axios";
import React, { useState, useEffect } from "react";

function Notes() {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editNoteId, setEditNoteId] = useState(null);


    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8080/api/users/logout", {}, { withCredentials: true });
            localStorage.removeItem("user");
            navigate('/');
        } catch (error) {
            console.error("Logout failed:", error.response?.data || error.message);
        }
    };

    const handleCreateNote = async () => {
        if (title.trim() === "") return;

        try {
            const res = await axios.post("http://localhost:8080/api/notes", {
                title,
                content
            });

            setNotes([...notes, res.data]);
            setTitle("");
            setContent("");
            setShowForm(false);
        } catch (err) {
            console.error("Error saving note:", err.response?.data || err.message);
        }
    };

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/notes");
                setNotes(res.data);
            } catch (err) {
                console.error("Error fetching notes:", err.response?.data || err.message);
            }
        };

        fetchNotes();
    }, []);

    const handleEditNote = (note) => {
        setEditNoteId(note.id);
        setTitle(note.title);
        setContent(note.content);
        setShowForm(true);
    };

    const handleSaveEdit = async () => {
        try {
            const res = await axios.put(`http://localhost:8080/api/notes/${editNoteId}`, {
                title,
                content
            });

            setNotes(prevNotes =>
                prevNotes.map(n => (n.id === editNoteId ? res.data : n))
            );
            setEditNoteId(null);
            setTitle("");
            setContent("");
            setShowForm(false);
        } catch (err) {
            console.error("Error updating note:", err);
        }
    };

    const handleDeleteNote = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/notes/${id}`);
            setNotes(notes.filter(note => note.id !== id));
        } catch (err) {
            console.error("Error deleting note:", err);
        }
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
                        <Link to="/notes" className="nav-link text-white">
                            <i className="bi bi-journal-text me-2"></i>
                            Notes
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
                <header className="bg-primary py-2 px-4 border-bottom shadow-sm d-flex justify-content-between align-items-center">
                    <h2 className="mb-0 text-light fw-bold">Notes</h2>
                    <div className="d-flex align-items-center gap-3">
                        <a href="https://www.facebook.com/alec.xander.espaldon.2024" target="_blank" rel="noopener noreferrer" className="text-light">
                            <i className="bi bi-facebook fs-4"></i>
                        </a>
                        <a href="https://github.com/alecxander567" target="_blank" rel="noopener noreferrer" className="text-light">
                            <i className="bi bi-github fs-4"></i>
                        </a>
                        <a href="https://www.reddit.com/user/Historical_Rub8018/" target="_blank" rel="noopener noreferrer" className="text-light">
                            <i className="bi bi-reddit fs-4"></i>
                        </a>
                    </div>
                </header>

                <main className="p-4 d-flex flex-column align-items-center">
                    <div className="w-100" style={{ maxWidth: "900px" }}>
                        <div className="d-flex justify-content-end mb-3">
                        <button
                            className="btn btn-success"
                            onClick={() => {
                            if (showForm || editNoteId) {
                                setShowForm(false);
                                setEditNoteId(null);
                                setTitle("");
                                setContent("");
                            } else {
                                setShowForm(true);
                            }
                            }}
                        >
                            <i className="bi bi-plus-circle me-2"></i>{" "}
                            {editNoteId ? "Cancel Editing" : showForm ? "Cancel" : "Create New Note"}
                        </button>
                        </div>

                        {showForm && (
                        <div className="card p-3 mb-4 shadow-sm">
                            <h5>{editNoteId ? "Edit Note" : "Create a New Note"}</h5>
                            <input
                            type="text"
                            placeholder="Enter note title"
                            className="form-control mb-2"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            />
                            <textarea
                            placeholder="Write your learning experience..."
                            className="form-control mb-2"
                            rows="4"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            ></textarea>
                            <button
                            className="btn btn-primary"
                            onClick={editNoteId ? handleSaveEdit : handleCreateNote}
                            >
                            {editNoteId ? "Update Note" : "Save Note"}
                            </button>
                        </div>
                        )}

                        <div className="d-flex flex-column gap-3">
                        {notes.length === 0 ? (
                            <p className="text-muted">No notes yet. Start by creating one!</p>
                        ) : (
                            notes.map((note) => (
                            <div className="card shadow-sm w-100" key={note.id}>
                                <div className="card-body">
                                <h5 className="card-title">{note.title}</h5>
                                <p className="card-text">{note.content}</p>
                                <div className="d-flex justify-content-end gap-2">
                                    <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => handleEditNote(note)}
                                    >
                                    <i className="bi bi-pencil-square"></i>
                                    </button>
                                    <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDeleteNote(note.id)}
                                    >
                                    <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                                </div>
                            </div>
                            ))
                        )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Notes;
