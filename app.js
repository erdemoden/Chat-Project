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
const { cookie } = require('express/lib/response');
const cookieParser = require('cookie-parser');
const jsCookie = require('js-cookie');
const { signedCookie } = require('cookie-parser');
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
function getKeyByValue(object,value){
    return Object.keys(object).find(key => object[key] == value);
}
let rooms = {}
let roomid = "";
io.on('connection',(socket)=>{
    socket.on('joinroom',(id,roomname,username,chatowner)=>{
        socket.join(id);
        socket.chatid = id;
        socket.names = username;
        socket.deletecount = 0;
        socket.connected = true;
        roomid = id;
        if(id in rooms&&rooms[id].includes(username)!=true){
            rooms[id].push(username);
        }
        else {
        rooms[id] = new Array();
        rooms[id].push(username);
        }
        io.to(id).emit("makechat",id,roomname,username,rooms,chatowner);
        console.log("bağlandık-socket");
    });
    socket.on("sendmessage",(message,sendername)=>{
        io.to(socket.chatid).emit("gotmessage",message,sendername);
    });
    socket.on("leavechat",()=>{
        socket.disconnect();
    });
    // socket.on("leave",(username)=>{
    //     //let id = getKeyByValue(rooms,username);
    //     let index = rooms[socket.chatid].indexOf(username);
    //     rooms[socket.chatid].splice(index,1);
    //     //socket.broadcast.to(socket.chatid).emit("eraseusername",username);
    //     socket.disconnect();
    // });
        socket.on("disconnect",()=>{
            if(socket.connected == true){
            let index = rooms[socket.chatid].indexOf(socket.names);
            rooms[socket.chatid].splice(index,1);
        }
            socket.broadcast.to(socket.chatid).emit("eraseuser",socket.names,socket.chatid,socket.deletecount+1);
        });
})