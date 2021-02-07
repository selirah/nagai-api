import socketio from 'socket.io';
import http from 'http';
import { app } from '../app';

const server = http.createServer(app);
const io = socketio(server);

export { io, server };
