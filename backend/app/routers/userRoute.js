import express from "express";
import { createNewUser, loginUser, getUserDetails, 
  getAllUser, updateUserDetails, deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/createNewUser", createNewUser); // register new user 
router.post("/loginUser", loginUser) // login user 
router.get("/getUserDetails/:id", getUserDetails);
router.get("/getAllUser", getAllUser);
router.put("/updateUserDetails/:id", updateUserDetails);
router.delete("/deleteUser/:id", deleteUser);

export default router;
