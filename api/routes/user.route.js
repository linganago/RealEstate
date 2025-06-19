import express from 'express';
import { test, updateUser,deleteUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:id', verifyToken, updateUser); // ✅ Use PUT
router.delete('/delete/:id', verifyToken, deleteUser); // ✅ Use PUT

export default router;
