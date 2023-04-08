import {  PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const getAllPosts = async (req: Request, res: Response) => {
    const posts = await prisma.post.findMany({
        where: {
            userId: req.user.id 
        }
    })
}

export { getAllPosts }