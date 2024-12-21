import React, { useState } from "react";
import { Form, Button, FloatingLabel } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
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
    const token = localStorage.getItem('token');
    if (!token ) {
      setError('No access token');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/api/createPost', formData,  {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Post is created', response.data);
      alert("Post is created");
    } catch (err) {
      console.error('Error registering:', err);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="auth-side-form w-50">
            <h4>Create new post</h4>
            {error && <p className="text-danger">{error}</p>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicName">
            <FloatingLabel controlId="floatingInput" label="Title" className="mb-2">
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                placeholder="Title"
                onChange={handleChange}
              />
            </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
            <FloatingLabel controlId="floatingInput" label="Content" className="mb-2">
              <Form.Control
                as="textarea"
                rows={3}
                name="content"
                value={formData.content}
                placeholder="Content"
                onChange={handleChange}
              />
            </FloatingLabel>
            </Form.Group>
            <div className="d-flex justify-content-center">
            <Button variant="info" type="submit">
              Post
            </Button>
          </div>
          </Form>
        </div>
    </div>
  );
};

export default NewPost;
