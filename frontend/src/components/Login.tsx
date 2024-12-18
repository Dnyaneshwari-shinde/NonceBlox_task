import React, { useState } from "react";
import { Form, Button, FloatingLabel } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
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
      const response = await axios.post('http://localhost:3000/api/loginUser', formData);
      console.log('Login successful:', response.data);

      // Save JWT token to localStorage or state management
      localStorage.setItem('token', response.data.token);

      // Redirect to dashboard or home page
      navigate('/Home');
    } catch (err) {
      console.error('Error logging in:', err);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="auth-side-form w-50">
            <h4>Login</h4>
            {error && <p className="text-danger">{error}</p>}
            <Form onSubmit={handleSubmit}>
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
              <Button variant="info" type="submit">Login</Button>
            </Form>
          </div>
    </div>
  );
}

export default Login;
