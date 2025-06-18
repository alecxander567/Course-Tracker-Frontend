import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button } from "react-bootstrap";
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setCredentials((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting credentials:", credentials); 
        try {
            const res = await axios.post("http://localhost:8080/api/users/login", credentials);
            navigate("/home");
        } catch (err) {
            alert("Invalid email or password.");
        }
    };

    return(
        <Container className="mt-5" style={{ maxWidth: "400px" }}>
            <h2 className="mb-4" style={{ fontWeight: "900" }}>
                Log In <i className="bi bi-box-arrow-in-right me-2"></i>
            </h2>

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    required
                />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                Log In
                </Button>
            </Form>
            <div className="d-flex justify-content-end mb-2 mt-4">
                <Link to="/" className="btn btn-outline-secondary btn-sm">
                <i className="bi bi-arrow-left-circle me-1"></i> Back to Home
                </Link>
            </div>
    </Container>
    );
}

export default Login;