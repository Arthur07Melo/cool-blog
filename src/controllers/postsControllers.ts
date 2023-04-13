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

const likePost = async (req: Request, res: Response) => {
    const reqParamsPattern = z.object({
        postID: z.number()
    })

    const { postID } = reqParamsPattern.parse(req.params);

    const isLiked = await prisma.likePostUser.findFirst({
        where:{
            userId: req.user.id,
            postId: postID
        }
    })

    if(isLiked){
        await prisma.likePostUser.delete({
            where: {
                userId_postId: {
                    postId: postID,
                    userId: req.user.id!
                }
            }
        })

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

    res.status(201).json({ message: "likePostUser created" });
}

export { getAllPosts, likePost }