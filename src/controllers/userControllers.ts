import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import z from 'zod';

const prisma = new PrismaClient();

const createUser = async (req: Request, res: Response) => {
    const userBodyPattern = z.object({
        username: z.string(),
        email: z.string().email(),
        password: z.string()
    });

    const { username, email, password } = userBodyPattern.parse(req.body);

    try{
        const hashPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.findFirst({
            where:{
                email: email
            }
        });

        if(user){
            return res.status(400).json({message: "user already exists"});
        }

        const newUser = await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashPassword
            }
        })

        const { password: _, ...newUserReturned} = newUser;

        res.status(201);
        res.json(newUserReturned);
    }catch(err){
        res.status(400).json({error: err});
    }
}

export { createUser }