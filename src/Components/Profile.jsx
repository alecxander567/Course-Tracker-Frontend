import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from "axios";

function Profile() {
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);

    const [profile, setProfile] = useState({
            name: "",
            course: "",
            address: "",
            school: "",
            bio: "",
            imageUrl: "", 
    });

    const [goals, setGoals] = useState([]);
    const [newGoal, setNewGoal] = useState("");
    const [formData, setFormData] = useState({ ...profile });
    const [isEditing, setIsEditing] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [stackInput, setStackInput] = useState(
        "html,css,js,react,bootstrap,java,python,php,nodejs,cpp,mysql,sqlite,express,django,spring,figma,git"
    );
    const [isEditingTechStack, setIsEditingTechStack] = useState(false);

    const handleToggleEdit = () => setIsEditing(!isEditing);

    useEffect(() => {
        axios.get("http://localhost:8080/api/profile/1")
        .then((res) => {
            setProfile(res.data);
            setFormData(res.data);
        })
        .catch((err) => console.error("Failed to fetch profile", err));
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file)); 
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData(profile); 
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleToggleTechStackEdit = () => {
        setIsEditingTechStack(!isEditingTechStack);
    };

    const handleStackChange = (e) => {
        setStackInput(e.target.value);
    };

  const handleSave = () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("course", formData.course);
    data.append("address", formData.address);
    data.append("school", formData.school);
    data.append("bio", formData.bio);

    if (selectedFile) {
        data.append("image", selectedFile); 
    }

    axios
        .put(`http://localhost:8080/api/profile/upload/1`, data, {
            headers: {
            "Content-Type": "multipart/form-data",
            },
        })
        .then((res) => {
            setProfile(res.data);
            setFormData(res.data);
            setPreviewImage(null);
            setIsEditing(false);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        })
        .catch((err) => console.error("Failed to save", err));
    };

    useEffect(() => {
        axios.get("http://localhost:8080/api/goals")
            .then(res => setGoals(res.data))
            .catch(err => console.error("Failed to fetch goals", err));
    }, []);

    const handleAddGoal = () => {
        if (!newGoal.trim()) return;

        axios.post("http://localhost:8080/api/goals", {
            text: newGoal,
            completed: false
        })
        .then(res => {
            setGoals(prev => [...prev, res.data]);
            setNewGoal("");
        });
    };

    const handleToggleGoal = (id, completed) => {
        axios.put(`http://localhost:8080/api/goals/${id}`, {
            ...goals.find(goal => goal.id === id),
            completed: !completed
        }).then(res => {
            setGoals(goals.map(goal => goal.id === id ? res.data : goal));
        });
    };

    const handleDeleteGoal = (id) => {
        axios.delete(`http://localhost:8080/api/goals/${id}`)
            .then(() => {
            setGoals(goals.filter(goal => goal.id !== id));
        });
    };

    const handleEditGoal = (id, newText) => {
        axios.put(`http://localhost:8080/api/goals/${id}`, {
            ...goals.find(goal => goal.id === id),
            text: newText
        }).then(res => {
            setGoals(goals.map(goal => goal.id === id ? res.data : goal));
        });
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
            <Link to="/home" className="nav-link text-white"><i className="bi bi-house-door me-2"></i>Dashboard</Link>
          </li>
          <li>
            <Link to="/courses" className="nav-link text-white"><i className="bi bi-book me-2"></i>My Courses</Link>
          </li>
          <li>
            <Link to="/profile" className="nav-link text-white"><i className="bi bi-person me-2"></i>Profile</Link>
          </li>
          <li>
            <Link to="/settings" className="nav-link text-white"><i className="bi bi-gear me-2"></i>Settings</Link>
          </li>
        </ul>
        <hr />
        <div>
          <button className="btn btn-danger w-100" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i>Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1" style={{ minHeight: "100vh", marginLeft: "250px" }}>
        <header className="bg-primary py-2 px-4 border-bottom shadow-sm d-flex justify-content-between align-items-center">
          <h2 className="mb-0 text-light" style={{ fontWeight: "900" }}>Profile</h2>
        </header>

        <main className="p-4">
                <div className="d-flex gap-4">
                    {/* Profile Card */}
                    <div
                        className="card shadow-sm"
                        style={{ width: "450px", height: "500px", border: "1px solid blue" }}
                    >
                        <div className="card-body d-flex flex-column pt-4 h-100">
                            {showAlert && (
                            <div className="alert alert-success py-1 px-2 mb-3 text-center" role="alert">
                                Profile changes saved successfully!
                            </div>
                            )}

                            <div style={{ overflowY: "auto", flex: 1, paddingRight: "6px" }}>
                                <div className="text-center mb-4">
                                    <img
                                        src={previewImage || profile.imageUrl || "https://via.placeholder.com/100"}
                                        alt="Profile"
                                        className="rounded-circle border border-2 border-primary mb-3"
                                        style={{ width: "120px", height: "120px", objectFit: "cover" }}
                                    />
                                    {isEditing && (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="form-control form-control-sm mb-2"
                                        onChange={(e) => handleImageChange(e)}
                                    />
                                    )}
                                    {isEditing ? (
                                    <>
                                        <input
                                            className="form-control mb-2 text-center"
                                            value={formData.name}
                                            onChange={(e) => handleChange("name", e.target.value)}
                                        />
                                        <input
                                            className="form-control form-control-sm text-center"
                                            value={formData.course}
                                            onChange={(e) => handleChange("course", e.target.value)}
                                        />
                                    </>
                                    ) : (
                                    <>
                                        <h5 className="card-title mb-1 fw-bold">{profile.name}</h5>
                                        <p className="text-muted mb-0 small">{profile.course}</p>
                                    </>
                                    )}
                                </div>

                                    <div className="mb-4">
                                        <div className="mb-3">
                                            <p className="mb-1 text-primary fw-semibold">
                                                <i className="bi bi-geo-alt-fill me-2"></i>
                                                {isEditing ? (
                                                <input
                                                    className="form-control form-control-sm"
                                                    value={formData.address}
                                                    onChange={(e) => handleChange("address", e.target.value)}
                                                />
                                                ) : (
                                                profile.address
                                                )}
                                            </p>
                                        </div>
                                            <div>
                                                <p className="mb-1 text-primary fw-semibold">
                                                    <i className="bi bi-building me-2"></i>
                                                    {isEditing ? (
                                                    <input
                                                        className="form-control form-control-sm"
                                                        value={formData.school}
                                                        onChange={(e) => handleChange("school", e.target.value)}
                                                    />
                                                    ) : (
                                                    profile.school
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                            <div className="mb-4">
                                                <p className="mb-2 fw-semibold">Bio:</p>
                                                {isEditing ? (
                                                <textarea
                                                    className="form-control"
                                                    rows={3}
                                                    value={formData.bio}
                                                    onChange={(e) => handleChange("bio", e.target.value)}
                                                />
                                                ) : (
                                                <p className="text-muted" style={{ whiteSpace: "pre-wrap" }}>
                                                    {profile.bio}
                                                </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="d-flex gap-2 mt-2">
                                        {isEditing ? (
                                            <>
                                            <button className="btn btn-primary btn-sm" onClick={handleSave}>Save</button>
                                            <button className="btn btn-secondary btn-sm" onClick={handleCancel}>Cancel</button>
                                            </>
                                        ) : (
                                            <button
                                            className="btn btn-primary btn-sm"
                                            onClick={handleEdit}
                                            style={{ marginTop: "-6px" }}
                                            >
                                            <i className="bi bi-pencil-square"></i> Edit Profile
                                            </button>
                                        )}
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex flex-column gap-3">
                                {/* Tech Stack Card */}
                                <div className="card shadow-sm" style={{ width: "490px", height: "200px" }}>
                                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                        <h6 className="mb-0">
                                            <i className="bi bi-laptop me-2"></i>
                                            Tech Stacks
                                        </h6>
                                        <button
                                            className="btn btn-sm btn-light text-primary fw-semibold"
                                            onClick={handleToggleTechStackEdit}
                                            >
                                            <i className="bi bi-pencil-square"></i> {isEditingTechStack ? "Save" : "Edit"}
                                        </button>
                                    </div>
                                    <div className="card-body d-flex flex-column justify-content-center align-items-center text-center">
                                        <p className="mb-3 fw-semibold">My Current Tech Stacks</p>
                                        {isEditingTechStack ? (
                                            <input
                                            className="form-control mb-2"
                                            value={stackInput}
                                            onChange={handleStackChange}
                                            placeholder="Enter comma-separated tech stacks"
                                            />
                                        ) : (
                                            <a
                                            href="https://skillicons.dev"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            >
                                            <img
                                                src={`https://skillicons.dev/icons?i=${stackInput}`}
                                                alt="My Skills"
                                                style={{ maxWidth: "100%", height: "auto" }}
                                            />
                                            </a>
                                        )}
                                    </div>
                                </div>

                            {/* Goals Checklist Card */}
                            <div className="card shadow-sm mt-3" style={{ width: "490px", height: "265px" }}>
                                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0">
                                    <i className="bi bi-list-check me-2"></i>
                                    My Goals for This Year
                                    </h6>
                                </div>
                                <div className="card-body d-flex flex-column p-3" style={{ height: "calc(100% - 56px)" }}>
                                    <div className="input-group mb-2">
                                    <input
                                        className="form-control"
                                        value={newGoal}
                                        onChange={(e) => setNewGoal(e.target.value)}
                                        placeholder="Add a new goal..."
                                    />
                                    <button className="btn btn-primary" onClick={handleAddGoal}>
                                        Add
                                    </button>
                                    </div>

                                    <div style={{ overflowY: "auto", flexGrow: 1 }}>
                                    <ul className="list-group list-group-flush">
                                        {goals.map((goal) => (
                                        <li
                                            key={goal.id}
                                            className="list-group-item d-flex align-items-center justify-content-between"
                                            style={{
                                            transition: "background-color 0.2s ease",
                                            borderRadius: "6px",
                                            cursor: "pointer"
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "skyblue")}
                                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                        >
                                            <div className="d-flex align-items-center w-100">
                                            <input
                                                type="checkbox"
                                                className="form-check-input me-2"
                                                style={{
                                                width: "18px",
                                                height: "18px",
                                                borderRadius: "50%",
                                                border: "2px solid #0d6efd",
                                                cursor: "pointer"
                                                }}
                                                checked={goal.completed}
                                                onChange={() => handleToggleGoal(goal.id, goal.completed)}
                                            />

                                            {goal.isEditing ? (
                                                <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                value={goal.text}
                                                onChange={(e) => handleEditGoal(goal.id, e.target.value)}
                                                />
                                            ) : (
                                                <span
                                                className="form-control-plaintext"
                                                style={{
                                                    textDecoration: goal.completed ? "line-through" : "none",
                                                    flex: 1
                                                }}
                                                >
                                                {goal.text}
                                                </span>
                                            )}
                                            </div>

                                            <div className="ms-2 d-flex">
                                                <button
                                                    className="btn btn-sm btn-warning me-1"
                                                    onClick={() =>
                                                    setGoals(goals.map(g =>
                                                        g.id === goal.id ? { ...g, isEditing: !g.isEditing } : g
                                                    ))
                                                    }
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDeleteGoal(goal.id)}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </li>
                                        ))}
                                    </ul>   
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
  );
}

export default Profile;
