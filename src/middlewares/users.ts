import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

type tokenPayload = {
    id: string
}

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    try{
    //bearer token -> excludes "bearer " from the string
    const token = authorization?.split(" ")[1];

    if(!authorization){
        return res.status(401).json({message: "unauthorized"});
    }

    const { id } = jwt.verify(token!, process.env.JWT_PASS!) as tokenPayload;

    const user = await prisma.user.findUnique({
        where:{
            id: id
        }
    });

    if(!user){
        return res.status(401).json({message: "unauthorized"});
    }

    const { password: _, ...loggedUser } = user;
    req.user = loggedUser;
    next();
    }catch(err){
        return res.status(400).json({error: err})
    }
}

export { checkAuth }