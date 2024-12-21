import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import supertest from 'supertest';
import app from '../index.js';
import bcrypt from 'bcrypt';
import User from '../app/models/userModel.js';
import jwt from 'jsonwebtoken';

jest.mock('bcrypt', () => ({
  hash: jest.fn(() => 'hashedPassword'),
  compare: jest.fn(() => true),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mockedJWTToken'),
}));


const request = supertest(app);
let mongoServer;
let registeredUser;

beforeAll(async () => {
  await mongoose.disconnect();
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});


afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
      await collections[key].deleteMany({});
  }
});


describe('User API tests', () => {
  it('should return 200 for GET /', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Backend is running!');
  });

  it('should create a new user for POST /createNewUser', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const response = await request.post('/api/createNewUser').send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(newUser.name);
    expect(response.body.email).toBe(newUser.email);

    // Validate data in the database
    const userInDb = await User.findOne({ email: newUser.email });
    expect(userInDb).not.toBeNull();
    expect(userInDb.name).toBe(newUser.name);
    expect(userInDb.email).toBe(newUser.email);
  });

  it('should return an error if user creation fails', async () => {
    const name = 'Jane Doe';
    const email = 'jane@example.com';
    const password = 'password123';

    bcrypt.hash.mockResolvedValue('hashedPassword123');
    
    // Use jest.spyOn() to mock User.save
    const saveSpy = jest.spyOn(User.prototype, 'save');
    saveSpy.mockRejectedValue(new Error('Error saving user'));

    const response = await request.post('/api/createNewUser')
      .send({ name, email, password });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Error saving user');

    saveSpy.mockRestore();
  });
});




describe('POST /login', () => {
  beforeEach(async () => {
      await User.create({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'hashedPassword', // Directly store mocked hashed password
      });
  });

  it('should login successfully with valid credentials', async () => {
      const res = await request.post('/api/loginUser') 
          .send({ email: 'john@example.com', password: 'password123' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Login successful');
      expect(res.body).toHaveProperty('token', 'mockedJWTToken');
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', 'John Doe');
  });

    it('should return error for invalid email', async () => {
        const res = await request.post('/api/loginUser')
            .send({ email: 'wrong@example.com', password: 'password123' });

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error', 'User not found');
    });

  it('should return error for invalid password', async () => {
      bcrypt.compare.mockResolvedValueOnce(false); // Mock invalid password
      const res = await request.post('/api/loginUser')
          .send({ email: 'john@example.com', password: 'wrongPassword' });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid credentials');
  });
});



import Post from "../app/models/postModel.js";
import { createPost, likePost} from '../app/controllers/postController.js';

jest.mock('../app/models/postModel.js');

describe('createPost', () => {
  let req, res;

  beforeEach(() => {
      req = {
          body: {
              title: 'Test Post',
              content: 'This is a test post content.',
          },
          user: {
              userId: '12345',
          },
      };

      res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };

      jest.clearAllMocks();
  });

  it('should create a new post and return 201 status code', async () => {
      // Mock the save method of the Post model
      const mockSave = jest.fn().mockResolvedValue({
          _id: 'testPostId',
          userId: '12345',
          title: 'Test Post',
          content: 'This is a test post content.',
      });

      // Mock the Post constructor to return an object with the mocked save method
      Post.mockImplementation(() => ({
          save: mockSave,
      }));

      await createPost(req, res);

      // Assertions
      expect(Post).toHaveBeenCalledWith({
          userId: '12345',
          title: 'Test Post',
          content: 'This is a test post content.',
      });
      expect(mockSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
          _id: 'testPostId',
          userId: '12345',
          title: 'Test Post',
          content: 'This is a test post content.',
      });
  });

  it('should return 400 status code on validation error', async () => {
      const errorMessage = 'Validation failed';
      Post.mockImplementation(() => ({
          save: jest.fn().mockRejectedValue(new Error(errorMessage)),
      }));

      await createPost(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  });
});


describe('likePost', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 'testPostId' },
      user: { userId: 'user123' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add a like to the post and return updated post', async () => {
    const mockPost = {
      _id: 'testPostId',
      likes: [],
      save: jest.fn().mockResolvedValue({
        _id: 'testPostId',
        likes: ['user123'],
      }),
    };

    jest.spyOn(Post, 'findById').mockResolvedValue(mockPost);

    await likePost(req, res);

    expect(Post.findById).toHaveBeenCalledWith('testPostId');
    expect(mockPost.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      _id: 'testPostId',
      likes: ['user123'],
    });
  });

  it('should remove a like from the post and return updated post', async () => {
    const mockPost = {
      _id: 'testPostId',
      likes: ['user123'],
      save: jest.fn().mockResolvedValue({
        _id: 'testPostId',
        likes: [],
      }),
    };

    jest.spyOn(Post, 'findById').mockResolvedValue(mockPost);

    await likePost(req, res);

    expect(Post.findById).toHaveBeenCalledWith('testPostId');
    expect(mockPost.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      _id: 'testPostId',
      likes: [],
    });
  });

  it('should return 404 if the post is not found', async () => {
    jest.spyOn(Post, 'findById').mockResolvedValue(null);

    await likePost(req, res);

    expect(Post.findById).toHaveBeenCalledWith('testPostId');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Post not found' });
  });

  it('should return 500 on internal server error', async () => {
    jest.spyOn(Post, 'findById').mockRejectedValue(new Error('Database error'));

    await likePost(req, res);

    expect(Post.findById).toHaveBeenCalledWith('testPostId');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
  });
});