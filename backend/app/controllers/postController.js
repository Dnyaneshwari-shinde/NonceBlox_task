import User from "../models/userModel.js";
import Post from "../models/postModel.js";

export const createPost = async (req, res) => {
  const { content } = req.body;
  try {
    const newPost = new Post({
      userId: req.user.userId, // user id from JWT token
      content,
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'name email') 
      .populate('likes', 'name')
      .populate('comments.userId', 'name');
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });


    // Add or remove user from the likes array
    const index = post.likes.indexOf(req.user.userId);
    if (index === -1) {
      post.likes.push(req.user.userId);
    } else {
      post.likes.splice(index, 1);
    }

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addComment = async (req, res) => {
  const { content } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    console.log("post", post);
    const newComment = {
      userId: req.user.userId, // user id from JWT token
      content,
    };

    post.comments.push(newComment);
    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    // Ensure the user is the post owner before deleting
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own posts' });
    }

    await post.remove();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
