import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { Container, Button, Row, Col, Navbar, Nav } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';

function Landingpage() {
    return(
        <>
        {/* Navbar */}
        <Navbar bg="white" expand="lg" className="shadow-sm fixed-top">
            <Container>
            <Navbar.Brand href="#" style={{ fontWeight: "900" }}>
                <i className="bi bi-journal-code me-2"></i>
                Course Tracker
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                <Nav style={{ gap: "5px"}}>
                <Button as={Link} to="/login" variant="outline-primary"> 
                    Log in
                </Button>
                <Button as={Link} to="/signup" variant="primary">
                    Sign Up
                </Button>
                </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>

        {/* Landing Page Content */}
        <div className="bg-light min-vh-100 d-flex align-items-center" style={{ paddingTop: "80px" }}>
            <Container>
                <Row className="justify-content-center text-center">
                <Col md={8}>
                    <div className="mb-3">
                    <i className="bi bi-mortarboard-fill text-primary fs-1 mx-2"></i>
                    <i className="bi bi-journal-text text-success fs-1 mx-2"></i>
                    <i className="bi bi-bar-chart-line-fill text-warning fs-1 mx-2"></i>
                    </div>

                    <h1 className="display-4 fw-bold">Welcome to Course Tracker</h1>

                    <p className="lead mt-3">
                        Keep track of all your learning courses in one place. Add, update, and manage your progress with ease.
                    </p>

                    <div className="my-4">
                    <i className="bi bi-pencil-square text-danger fs-3 mx-2"></i>
                    <i className="bi bi-check2-circle text-success fs-3 mx-2"></i>
                    <i className="bi bi-clock-history text-info fs-3 mx-2"></i>
                    </div>

                    <Button  as={Link} to="/login" variant="primary" size="lg" href="#courses">
                        Get Started
                    </Button>
                </Col>
                </Row>
            </Container>
        </div>

        {/* Features Section */}
        <section className="py-5 bg-white border-top">
            <Container>
                <h2 className="text-center mb-5 fw-bold">Features</h2>
                <Row className="g-4">
                <Col md={4} className="text-center">
                    <i className="bi bi-journal-text text-primary fs-1 mb-3"></i>
                    <h5 className="fw-bold">Organize Your Notes</h5>
                    <p className="text-muted">Easily jot down and edit learning notes for each course you take.</p>
                </Col>
                <Col md={4} className="text-center">
                    <i className="bi bi-bar-chart-line text-success fs-1 mb-3"></i>
                    <h5 className="fw-bold">Track Progress</h5>
                    <p className="text-muted">Monitor your course completion and stay motivated with clear progress tracking.</p>
                </Col>
                <Col md={4} className="text-center">
                    <i className="bi bi-cloud-upload text-warning fs-1 mb-3"></i>
                    <h5 className="fw-bold">Access Anywhere</h5>
                    <p className="text-muted">Securely save your learning data and access it across all your devices.</p>
                </Col>
                </Row>
            </Container>
        </section>

        <footer className="bg-white text-center py-4 border-top mt-auto">
            <Container>
                <p className="mb-2">© {new Date().getFullYear()} Course Tracker</p>
                <div>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-primary mx-3 fs-4">
                    <i className="bi bi-facebook"></i>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-dark mx-3 fs-4">
                    <i className="bi bi-github"></i>
                </a>
                <a href="https://reddit.com" target="_blank" rel="noopener noreferrer" className="text-danger mx-3 fs-4">
                    <i className="bi bi-reddit"></i>
                </a>
                </div>
            </Container>
        </footer>
      </>
    );
}

export default Landingpage;