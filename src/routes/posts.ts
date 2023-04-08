import express from "express";
import { getAllPosts } from "../controllers/postsControllers"

const router = express.Router();

router.get("/", getAllPosts);



export default router;