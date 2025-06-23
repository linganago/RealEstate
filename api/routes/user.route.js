import express from 'express';
import { test, updateUser,deleteUser, getUserListing } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:id', verifyToken, updateUser); // ✅ Use PUT
router.delete('/delete/:id', verifyToken, deleteUser); // ✅ Use PUT
router.get('/listings/:id', verifyToken, getUserListing); // ✅ Use PUT

export default router;
