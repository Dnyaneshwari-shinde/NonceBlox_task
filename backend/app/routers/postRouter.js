import express from 'express';
import { jwtToken } from "../middleware/jwtToken.js";
import { createPost, getPosts, likePost, addComment, deletePost, } from '../controllers/postController.js';

const router = express.Router();

router.post('/createPost', jwtToken, createPost); 
router.get('/getPosts', getPosts);
router.put('/post/like/:id', jwtToken, likePost); 
router.post('/post/comment/:id',jwtToken, addComment);
router.delete('/post/:id',jwtToken, deletePost); 

export default router;
