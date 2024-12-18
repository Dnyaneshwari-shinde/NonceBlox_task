import React, { useState } from "react";
import { Form, Button, FloatingLabel } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/createNewUser', formData);
      console.log('Registration successful:', response.data);
      // Redirect to login or home page
      navigate('/login');
    } catch (err) {
      console.error('Error registering:', err);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="auth-side-form w-50">
            <h4>Create your account</h4>
            {error && <p className="text-danger">{error}</p>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicName">
            <FloatingLabel controlId="floatingInput" label="Name" className="mb-2">
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                placeholder="Name"
                onChange={handleChange}
              />
            </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
            <FloatingLabel controlId="floatingInput" label="Email" className="mb-2">
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                placeholder="Email"
                onChange={handleChange}
              />
            </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
            <FloatingLabel controlId="floatingInput" label="Password" className="mb-2">
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                placeholder="Password"
                onChange={handleChange}
              />
            </FloatingLabel>
            </Form.Group>
            <div className="d-flex justify-content-center">
            <Button variant="info" type="submit">
              Register
            </Button>
          </div>
          </Form>
        </div>
    </div>
  );
};

export default Register;
