import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button } from "react-bootstrap";
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Signup() {
  const [user, setUser] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/users/signup", user);
      alert(res.data);
    } catch (err) {
      alert("Error during signup");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "400px" }}>
   
      <h2 className="mb-4" style={{ fontWeight: "900" }}>
        Sign Up <i className="bi bi-person-plus-fill me-2"></i>
      </h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={user.email}
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
            value={user.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="success" type="submit" className="w-100">
          Create Account
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

export default Signup;
