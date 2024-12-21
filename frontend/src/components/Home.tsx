import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Container, Tabs, Tab, Form, FloatingLabel } from 'react-bootstrap';
import axios from 'axios';
import { MdDelete } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import AddCommentModal from './AddCommentModal'; 
import NewPost from "./NewPost";

const Home = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [comment, setComment] = useState<string>('');

  const loggedInUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No access token found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/api/getPosts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("data",response.data)
        setPosts(response.data);
      } catch (err) {
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [posts]);

  const handleLike = async (postId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No access token found');
      return;
    }
   
    try {
      const response = await axios.put(
        `http://localhost:3000/api/post/like/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: response.data.likes } : post
        )
      );
    } catch (err) {
      console.error(`Failed to like post ${postId}`, err);
    }
  };

  const handleAddComment = async () => {
    const token = localStorage.getItem('token');
    if (!token || !currentPostId) {
      setError('No access token or post ID found');
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:3000/api/post/comment/${currentPostId}`,
        { content: comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update comments in the local state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === currentPostId
            ? { ...post, comments: [...post.comments, response.data] }
            : post
        )
      );

      // Close the modal
      setShowModal(false);
      setComment('');
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  };

  const openModal = (postId: string) => {
    setCurrentPostId(postId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setComment('');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const deleteUserPost = async(postId: string)  =>  {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No access token.');
      return;
    }
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.message);
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  }


  return (
    <div className="auth-wrapper align-items-stretch aut-bg-img">
        <Tabs defaultActiveKey="post" id="uncontrolled-tab-example" className="mb-3">
        <Tab eventKey="post" title="Posts">
          <Container>
            <Row xs={1} md={2} className="g-4">
              {posts.map((post: any) => (
                <Col key={post._id}>
                  <Card style={{ width: '100%' }}>
                    <Card.Body>
                      <Card.Title>{post.title}</Card.Title>
                      <Card.Text>{post.content}</Card.Text>
                      <Card.Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleLike(post._id);
                        }}>
                        {post.likes.some((i: { _id: string | null; }) => i._id === loggedInUserId) ? (
                          <><FaHeart /> {post.likes.length} Likes </>
                        ) : (
                          <><FaRegHeart /> {post.likes.length} Likes</>
                        )}
                      </Card.Link>
                      <Card.Link href="#">{post.comments.length} Comments</Card.Link>
                      <div className="d-flex justify-content-between mt-3">
                        <Button variant="primary" onClick={() => openModal(post._id)}> Add Comment </Button>
                        <Button variant="secondary">Read Comments</Button>
                        {post.userId._id === loggedInUserId && (
                        <MdDelete size={40} onClick={()  => deleteUserPost(post._id)}/>
                      )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
          </Tab>
          <Tab eventKey="newPost" title="Create Post">
           <NewPost/>
          </Tab>
          </Tabs>

      <AddCommentModal
        show={showModal}
        onHide={closeModal}
        onSubmit={handleAddComment}
        comment={comment}
        setComment={setComment}
      />
    </div>
  );
};

export default Home;
