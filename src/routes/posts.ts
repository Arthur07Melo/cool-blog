import express from "express";
import { getAllPosts, likePost } from "../controllers/postsControllers"

const router = express.Router();


router.get("/:postID", likePost);
router.get("/", getAllPosts);



export default router;