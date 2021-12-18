const express = require('express');
const app = express();
const cookieparser = require('cookie-parser');
const db = require('./db')();
const log = require('./Routes/log.js');
require("dotenv").config();
const http = require("http");
//const bodyParser = require('body-parser');
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
server.listen(process.env.PORT||1998);
app.use(express.static('images'));
app.use(express.static('scripts'));
app.set('view-engine','ejs');
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({extended:true}));


app.use('/',log);



// SOCKET-IO

let rooms = {}
io.on('connection',(socket)=>{
    socket.on('joinroom',(id,roomname,username,chatowner)=>{
        socket.join(id);
        rooms[id] = new Array();
        rooms[id].push(username);
        io.to(id).emit("makechat",id,roomname,username,rooms,chatowner);
        console.log("bağlandık-socket");
    });
    socket.on("disconnect",()=>{
        console.log("bağlantı gitti");
    });
})