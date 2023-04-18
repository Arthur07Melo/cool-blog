import {  PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";

const prisma = new PrismaClient();

const getAllPosts = async (req: Request, res: Response) => {
    const posts = await prisma.post.findMany({
        where: {
            userId: req.user.id
        }
    })
}


const addPost = async (req: Request, res: Response) => {
    const reqBodyPattern = z.object({
        title: z.string(),
        description: z.string()
    });

    const { title, description } = reqBodyPattern.parse(req.body);

    const newPost = await prisma.post.create({
        data: {
            title: title,
            description: description,
            user: {
                connect: {
                    id: req.user.id
                }
            }
        }
    });

    res.status(201);
    res.json(newPost);
}


const deletePost = async (req: Request, res: Response) => {
    const reqParamsPattern = z.object({
        postID: z.number()
    });

    const { postID } = reqParamsPattern.parse(req.params);
    
    const post = await prisma.post.findUnique({
        where: {
            id: postID
        }
    });  

    if(!post){
        return res.status(400).json({ message: `post with id ${postID} does not exist`});
    }

    if(post.userId != req.user.id) {
        return res.status(401).json({ message: "User does not have authorization to delete this post."});
    }

    await prisma.post.delete({
        where: {
            id: postID
        }
    });
    
    res.status(200);
    res.json({ message: `Post ${postID} deleted with sucess.`});
}


const likePost = async (req: Request, res: Response) => {
    const reqParamsPattern = z.object({
        postID: z.number()
    });

    const { postID } = reqParamsPattern.parse(req.params);

    const isLiked = await prisma.likePostUser.findFirst({
        where:{
            userId: req.user.id,
            postId: postID
        }
    });

    if(isLiked){
        await prisma.likePostUser.delete({
            where: {
                userId_postId: {
                    postId: postID,
                    userId: req.user.id!
                }
            }
        });

        return res.status(200).json({ message: "likePostUser deleted" });
    }

    await prisma.likePostUser.create({
        data: {
            user: {
                connect: {
                    id: req.user.id
                }
            },
            post: {
                connect: {
                    id: postID
                }
            }
        }
    })

    res.status(201).json({ message: `Post ${postID} liked by user ${req.user.id}.` });
}

export { getAllPosts, addPost, likePost, deletePost }