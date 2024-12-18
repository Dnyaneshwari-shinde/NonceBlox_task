import express from "express";
import { createNewUser, getUserDetails, 
  getAllUser, updateUserDetails, deleteUser } from "../controllers/UserController.js";

const router = express.Router();

router.post("/userapi", createNewUser);
router.get("/getUserDetails/:id", getUserDetails);
router.get("/getAllUser", getAllUser);
router.put("/updateUserDetails/:id", updateUserDetails);
router.delete("/deleteUser/:id", deleteUser);

export default router;
