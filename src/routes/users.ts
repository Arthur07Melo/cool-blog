import express from 'express';
import { createUser, loginUser } from '../controllers/userControllers';

const router = express.Router();


router.post("/signin", createUser);
router.post("/login", loginUser);


export default router;