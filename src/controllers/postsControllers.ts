import {  PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const getAllPosts = (req: Request, res: Response) => {
    
}