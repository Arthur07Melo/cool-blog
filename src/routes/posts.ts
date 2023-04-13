import express from "express";
import { addPost, getAllPosts, likePost } from "../controllers/postsControllers"

const router = express.Router();


router.get("/", getAllPosts);
router.post("/", addPost);
router.get("/:postID", likePost);


export default router;