import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

interface AddCommentModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (comment: string) => void;
  comment: string;
  setComment: React.Dispatch<React.SetStateAction<string>>;
}

const AddCommentModal: React.FC<AddCommentModalProps> = ({
  show,
  onHide,
  onSubmit,
  comment,
  setComment,
}) => {
  const [error, setError] = useState<string>(''); // Error state

  const handleSubmit = () => {
    if (!comment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    setError(''); 
    onSubmit(comment);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Comment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group controlId="comment">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Send
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddCommentModal;
