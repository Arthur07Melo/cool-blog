import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import { checkAuth } from './middlewares/users';
import posts from './routes/posts';


const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));

app.use(checkAuth);
app.use("/post", posts);



app.all("*", (req: Request, res: Response)=>{
    res.status(404);
    res.json("Page not found");
})

app.listen(5000, ()=>{
    console.log("Server running on port 5000\nlink: http://localhost:5000");
})