import User from "../models/Users.js"

export const createNewUser = async (req,res) =>  {
    console.log("here")
    try {
        const newUser = new User(req.body);
        console.log("here 2", newUser)
        const savedUser = await newUser.save();
        console.log("here 3", savedUser)
        res.status(201).json(savedUser);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
}


export const getUserDetails = async (req,res) =>  {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}

export const getAllUser = async (req,res)  =>  {
    try {
        const users = await User.find();
        res.status(200).json(users);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}

export const updateUserDetails = async (req, res) =>  {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(updatedUser);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
}


export const deleteUser = async (req,res)  =>  {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}