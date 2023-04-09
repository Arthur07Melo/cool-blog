import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import z from 'zod';

const prisma = new PrismaClient();

const createUser = async (req: Request, res: Response) => {
    const reqBodyPattern = z.object({
        username: z.string(),
        email: z.string().email(),
        password: z.string()
    });

    const { username, email, password } = reqBodyPattern.parse(req.body);

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


const loginUser = async (req: Request, res: Response) => {
    const reqBodyPattern = z.object({
        email: z.string().email(),
        password: z.string()
    });

    const { email, password } = reqBodyPattern.parse(req.body);

    try{
        const user = await prisma.user.findUnique({
            where: {
                email: email,   
            }
        });

        if(!user){
            return res.status(400).json({message: "User does not exists"});
        }

        const correctPassword = await bcrypt.compare(password, user.password);
        if(!correctPassword){
            return res.status(401).json({message: "Incorrect email or password"});
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_PASS!, { expiresIn: "4h"});
        res.status(200).json(token);
    }catch(err){
        res.status(400).json({error: err});
    }
}

export { createUser, loginUser };