import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import '../css/Homepage.css';
import axios from "axios";
import React, { useState, useEffect } from "react";

function Courses() {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [newSubject, setNewSubject] = useState("");
    const [newSubjectNote, setNewSubjectNote] = useState("");
    const [editNote, setEditNote] = useState("");

    const [year, setYear] = useState(1); 
    const [editIndex, setEditIndex] = useState(null);
    const [editName, setEditName] = useState("");

    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState("");
    const [editProjectIndex, setEditProjectIndex] = useState(null);
    const [editProjectName, setEditProjectName] = useState("");
    const [newProjectDescription, setNewProjectDescription] = useState("");

    const getYearSuffix = (year) => {
        const suffixes = ["th", "st", "nd", "rd"];
        const v = year % 100;
        return year + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    };

    useEffect(() => {
        axios.get(`http://localhost:8080/api/courses/${year}`)
            .then(res => setSubjects(res.data))
            .catch(err => console.error("Fetch error:", err));
    }, [year]);

    const addSubject = () => {
        if (!newSubject.trim()) return;

        const subjectObj = {
            name: newSubject,
            note: newSubjectNote, 
            yearLevel: year
        };

        axios.post("http://localhost:8080/api/courses", subjectObj)
            .then(res => {
                setSubjects([...subjects, res.data]);
                setNewSubject("");
                setNewSubjectNote(""); 
            })
            .catch(err => console.error("Add error:", err));
    };

    const updateNote = (index, note) => {
        const subject = subjects[index];
        const updatedSubject = { ...subject, note };

        axios.put(`http://localhost:8080/api/courses/${subject.id}`, updatedSubject)
            .then(res => {
                const updated = [...subjects];
                updated[index] = res.data;
                setSubjects(updated);
            })
            .catch(err => console.error("Update error:", err));
    };

    const startEdit = (index) => {
        setEditIndex(index);
        setEditName(subjects[index].name);
        setEditNote(subjects[index].note || ""); 
    };

    const cancelEdit = () => {
        setEditIndex(null);
        setEditName("");
        setEditNote("");
    };

    const saveEdit = (index) => {
        const subject = subjects[index];
        const updatedSubject = {
            ...subject,
            name: editName,
            note: editNote, 
        };

        axios.put(`http://localhost:8080/api/courses/${subject.id}`, updatedSubject)
            .then(res => {
                const updated = [...subjects];
                updated[index] = res.data;
                setSubjects(updated);
                setEditIndex(null);
                setEditName("");
                setEditNote(""); 
            })
            .catch(err => console.error("Update error:", err));
    };

    const deleteSubject = (id) => {
        axios.delete(`http://localhost:8080/api/courses/${id}`)
            .then(() => {
                setSubjects(subjects.filter(subject => subject.id !== id));
            })
            .catch(err => console.error("Delete error:", err));
    };

    useEffect(() => {
        axios.get(`http://localhost:8080/api/projects/${year}`)
            .then(res => setProjects(res.data))
            .catch(err => console.error("Fetch projects error:", err));
    }, [year]);

    const addProject = () => {
        if (!newProject.trim()) return;

        const projectObj = {
            name: newProject,
            description: newProjectDescription,
            yearLevel: year
        };

        axios.post("http://localhost:8080/api/projects", projectObj)
            .then(res => {
                setProjects([...projects, res.data]);
                setNewProject("");
                setNewProjectDescription(""); 
            })
            .catch(err => console.error("Add project error:", err));
    };

    const updateProjectDescription = (index, description) => {
        const updated = [...projects];
        updated[index].description = description;
        setProjects(updated);
    };

    const startProjectEdit = (index) => {
        setEditProjectIndex(index);
        setEditProjectName(projects[index].name);
    };

    const saveProjectEdit = (index) => {
        const project = projects[index];
        const updatedProject = {
            ...project,
            name: editProjectName,
            description: project.description
        };

        axios.put(`http://localhost:8080/api/projects/${project.id}`, updatedProject)
            .then(res => {
                const updated = [...projects];
                updated[index] = res.data;
                setProjects(updated);
                setEditProjectIndex(null);
            })
            .catch(err => console.error("Edit project error:", err));
    };

    const deleteProject = (id) => {
        axios.delete(`http://localhost:8080/api/projects/${id}`)
            .then(() => {
                setProjects(projects.filter((p) => p.id !== id));
            })
            .catch(err => console.error("Delete project error:", err));
    };

    const handleLogout = async () => {
        try {
            const res = await axios.post("http://localhost:8080/api/users/logout", {}, { withCredentials: true });
            localStorage.removeItem("user");
            navigate('/');
        } catch (error) {
            console.error("Logout failed:", error.response?.data || error.message);
        }
    };

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div className="d-flex flex-column flex-shrink-0 p-3 bg-primary text-white"
                style={{ width: "250px", height: "100vh", position: "fixed", top: 0, left: 0, zIndex: 1000 }}>
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
                    <h2 className="mb-0 text-light" style={{ fontWeight: "900" }}>Courses</h2>
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

                <main className="p-4">
                    {/* Year Picker */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Select Year Level:</label>
                        <select
                            className="form-select w-auto"
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                        >
                            <option value={1}>1st Year</option>
                            <option value={2}>2nd Year</option>
                            <option value={3}>3rd Year</option>
                            <option value={4}>4th Year</option>
                        </select>
                    </div>

                    <div className="col-12 mb-5">
                        <div className="card shadow-sm">
                            <div className="card-header bg-primary text-white d-flex align-items-center">
                                <i className="bi bi-book me-2 fs-5"></i>
                                <h5 className="mb-0">{getYearSuffix(year)} Year</h5>
                            </div>
                            <div className="card-body">
                                {/* Subject List */}
                                {subjects.map((subject, index) => (
                                    <div key={subject.id} className="card mb-3 border-0 border-start border-4 border-primary-subtle shadow-sm">
                                        <div className="card-body">
                                            {editIndex === index ? (
                                                <>
                                                    <input
                                                        type="text"
                                                        className="form-control mb-2"
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                    />
                                                    <textarea
                                                        className="form-control mb-2"
                                                        placeholder="Subject Description"
                                                        value={editNote}
                                                        onChange={(e) => setEditNote(e.target.value)}
                                                        rows={5}
                                                        maxLength={10000}
                                                    />
                                                    <div className="d-flex gap-2">
                                                        <button className="btn btn-success btn-sm" onClick={() => saveEdit(index)}>
                                                            <i className="bi bi-bookmark-fill"></i> Save
                                                        </button>
                                                        <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>
                                                            <i className="bi bi-x-square"></i> Cancel
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <h6 className="fw-bold">{subject.name}</h6>
                                                    <p className="mb-2 text-muted" style={{ whiteSpace: "pre-wrap" }}>
                                                        {subject.note || <em>No description provided</em>}
                                                    </p>
                                                    <div className="d-flex gap-2">
                                                        <button className="btn btn-warning btn-sm" onClick={() => startEdit(index)}>
                                                            <i className="bi bi-pencil-square"></i> Edit
                                                        </button>
                                                        <button className="btn btn-danger btn-sm" onClick={() => deleteSubject(subject.id)}>
                                                            <i className="bi bi-trash"></i> Delete
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Add New Subject Form */}
                                <div className="mt-4">
                                    <h6 className="text-primary fw-bold mb-3">
                                        <i className="bi bi-plus-circle me-2"></i> Add New Subject
                                    </h6>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="New Subject"
                                        value={newSubject}
                                        onChange={(e) => setNewSubject(e.target.value)}
                                    />
                                    <textarea
                                        className="form-control mb-2"
                                        placeholder="Subject Description"
                                        value={newSubjectNote}
                                        onChange={(e) => setNewSubjectNote(e.target.value)}
                                        rows={5}
                                        maxLength={10000}
                                    />
                                    <button className="btn btn-primary w-100" onClick={addSubject}>
                                        <i className="bi bi-plus-square me-2"></i> Add Subject
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Projects Card */}
                    <div className="col-12 mb-5">
                        <div className="card shadow-sm">
                            <div className="card-header bg-success text-white d-flex align-items-center">
                                <i className="bi bi-laptop me-2 fs-5"></i>
                                <h5 className="mb-0">{getYearSuffix(year)} Year Projects</h5>
                            </div>
                            <div className="card-body">
                                {/* Project List */}
                                {projects.map((project, index) => (
                                    <div key={project.id} className="card mb-3 border-0 border-start border-4 border-success-subtle shadow-sm">
                                        <div className="card-body">
                                            {editProjectIndex === index ? (
                                                <>
                                                    <input
                                                        type="text"
                                                        className="form-control mb-2"
                                                        value={editProjectName}
                                                        onChange={(e) => setEditProjectName(e.target.value)}
                                                    />
                                                    <textarea
                                                        className="form-control mb-3"
                                                        rows={3}
                                                        placeholder="Project Description..."
                                                        value={project.description}
                                                        onChange={(e) => updateProjectDescription(index, e.target.value)}
                                                    />
                                                    <div className="d-flex gap-2">
                                                        <button className="btn btn-success btn-sm" onClick={() => saveProjectEdit(index)}>
                                                            <i className="bi bi-bookmark-fill"></i> Save
                                                        </button>
                                                        <button className="btn btn-secondary btn-sm" onClick={() => setEditProjectIndex(null)}>
                                                            <i className="bi bi-x-square"></i> Cancel
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <h6 className="fw-bold">{project.name}</h6>
                                                    <p className="mb-2 text-muted">{project.description || <em>No description</em>}</p>
                                                    <div className="d-flex gap-2">
                                                        <button className="btn btn-warning btn-sm" onClick={() => startProjectEdit(index)}>
                                                            <i className="bi bi-pencil-square"></i> Edit
                                                        </button>
                                                        <button className="btn btn-danger btn-sm" onClick={() => deleteProject(project.id)}>
                                                            <i className="bi bi-trash"></i> Delete
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Add New Project Form */}
                                <div className="mt-4">
                                    <h6 className="text-success fw-bold mb-3">
                                        <i className="bi bi-plus-circle me-2"></i> Add New Project
                                    </h6>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Project Name"
                                        value={newProject}
                                        onChange={(e) => setNewProject(e.target.value)}
                                    />
                                    <textarea
                                        className="form-control mb-2"
                                        placeholder="Project Description"
                                        rows={3}
                                        value={newProjectDescription}
                                        onChange={(e) => setNewProjectDescription(e.target.value)}
                                    />
                                    <button className="btn btn-success w-100" onClick={addProject}>
                                        <i className="bi bi-plus-square me-2"></i> Add Project
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Courses;
