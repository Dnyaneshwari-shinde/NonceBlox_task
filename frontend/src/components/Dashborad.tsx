import React from "react";
import { NavLink } from 'react-router-dom';
import { Button, Col } from 'react-bootstrap';

const Dashboard = () => {
    return (
        <div className="auth-wrapper align-items-stretch aut-bg-img">
            <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
                <div className="text-center">
                    <h1 className="mb-3">Welcome to Social Media Proof of Concept</h1>
                    <h4 className="mb-4">Create your own post and share comments.</h4>
                </div>
                <Col className="d-flex gap-3 justify-content-center">
                    <NavLink to="/Register">
                        <Button variant="outline-info">Register</Button>
                    </NavLink>
                    <NavLink to="/Login">
                        <Button variant="outline-info">Login</Button>
                    </NavLink>
                </Col>
            </div>
        </div>
    );
};

export default Dashboard;
