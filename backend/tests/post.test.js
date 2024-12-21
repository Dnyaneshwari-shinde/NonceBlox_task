// import mongoose from 'mongoose';
// import { MongoMemoryServer } from 'mongodb-memory-server';
// import supertest from 'supertest';
// import app from '../index.js';
// import jwt from 'jsonwebtoken';
// import User from '../app/models/userModel.js';
// import bcrypt from 'bcrypt';
// const request = supertest(app);

// jest.spyOn(console, 'log').mockImplementation(() => {});
// jest.mock('bcrypt');
// jest.mock('jsonwebtoken');

// jwt.sign.mockReturnValue('mocked-token');

// bcrypt.compare.mockResolvedValue(true);

// let mongoServer;

// beforeAll(async () => {
//   await mongoose.disconnect(); // Disconnect any active connections
//   mongoServer = await MongoMemoryServer.create();
//   const uri = mongoServer.getUri();
//   await mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
// });

// afterAll(async () => {
//   await mongoose.connection.close();
// });



// describe('Create Post API tests', () => {
//   let token;

//   beforeAll(() => {
//     // Mock a JWT token for user authentication
//     const mockUser = { userId: '12345' };
//     token = jwt.sign(mockUser, 'NonceBlox', { expiresIn: '5h' });
//   });

//   afterAll(async () => {
//     jest.clearAllMocks();
//     await mongoose.connection.close();
//   });

//   it('should create a new post and return 201 status', async () => {
//     const postData = {
//       title: 'My First Post',
//       content: 'This is the content of my first post.',
//     };

//     const mockSavedPost = {
//       _id: '645f9a8e0c7a2e1b789e4c8d',
//       userId: '12345',
//       title: postData.title,
//       content: postData.content,
//     };

//     // // Mock the save method to return the saved post
//     // Post.mockImplementation(() => ({
//     //   save: jest.fn().mockResolvedValue(mockSavedPost),
//     // }));

//     const response = await request
//       .post('/api/createPost') // Replace with your actual route
//       .set('Authorization', `Bearer ${token}`) // Set the authorization header
//       .send(postData);

//     console.log("res",response)
//     // expect(response.status).toBe(201);`
//     // expect(response.body).toHaveProperty('_id');
//     // expect(response.body.title).toBe(postData.title);
//     // expect(response.body.content).toBe(postData.content);
//     // expect(response.body.userId).toBe('12345');
//   });

// //   it('should return 400 if required fields are missing', async () => {
// //     const postData = {
// //       title: 'My First Post', // Missing content
// //     };

// //     const response = await request
// //       .post('/api/createPost') // Replace with your actual route
// //       .set('Authorization', `Bearer ${token}`) // Set the authorization header
// //       .send(postData);

// //     expect(response.status).toBe(400);
// //     expect(response.body).toHaveProperty('error');
// //   });
// });
