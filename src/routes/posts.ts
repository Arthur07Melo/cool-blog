import express from "express";
import { addPost, getAllPosts, likePost, deletePost } from "../controllers/postsControllers"

const router = express.Router();


router.get("/", getAllPosts);
router.post("/", addPost);
router.delete("/:postID", deletePost);
router.get("/:postID", likePost);


export default router;