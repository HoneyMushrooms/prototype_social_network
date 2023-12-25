import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { env } from 'process';
import cookieParser from "cookie-parser";
import Router from "./routers/index.js";
import errorMiddleware from './middlewares/errorMiddleware.js';
import redisDB from './db/redisDB.js';
import { createDatabaseAndTables } from './db/postgresDB.js';
import { WebSocketServer, WebSocket} from 'ws';

declare global {
    namespace Express {
        interface Request {
            id: string;
            file?: Express.Multer.File;
        }
    }
}

dotenv.config();
const app = express();

app.use(express.static('files'));
app.use(cors({ credentials: true, origin: env.CLIENT_URL }));
app.use(express.json());
app.use(cookieParser());
app.use('/api', Router);
app.use(errorMiddleware);

const sockets = new Map<string, WebSocket[]>();

try {
    await redisDB.connect();
    await createDatabaseAndTables();

    const server = app.listen(env.SERVER_PORT, () => console.log(`Server started on the port ${env.SERVER_PORT}`));
    const ws = new WebSocketServer({ server });
    
    ws.on('connection', (socket, req) => {
        const id = req.url?.slice(1);
        
        if(!id) {
            throw new Error('something wrong');
        }
        
        const socketsData = sockets.get(id);

        if(socketsData) {
            socketsData.push(socket);
        } else {
            sockets.set(id, [socket]);         
        }
        
        socket.on('message', (message) => {
            const msg = JSON.parse(message.toString());
            const recipient = sockets.get(msg.to);
            
            if(recipient) {
                recipient.forEach(socket => socket.send(JSON.stringify(msg)));
            }
        });
        
        socket.on('error', console.error);

        socket.on('close', () => {
            const socketData = sockets.get(id) as WebSocket[]; 
            const index = socketData.indexOf(socket);
            if(index !== -1) {
                socketData.splice(index, 1);
            }
            if(!socketData.length) {
                sockets.delete(id);
            }
        });
    });

} catch (err) {
    console.error(err, ' :(');
}


