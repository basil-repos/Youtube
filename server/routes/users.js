import express from 'express';
import { deleteUser, getUser, subscribe, unsubscribe, update, userHistory } from '../controllers/user.js';
import { verifyToken } from '../verifyToken.js';

const router = express.Router();

// UPDATE USER
router.put("/:id", verifyToken, update);

// DELETE A USER
router.delete("/:id", verifyToken, deleteUser);

// GET A USER
router.get("/find/:id", getUser);

// SUBSCRIBE A USER
router.put("/subscribe/:id", verifyToken, subscribe);

// UNSUBSCRIBE A USER
router.put("/unsubscribe/:id", verifyToken, unsubscribe);

// User History
router.get("/history", verifyToken, userHistory);

export default router;