const express = require("express")
const router = express.Router();
const User = require('../users2');
const jwt = require('jsonwebtoken');
const { rawListeners } = require("../users2");
const bcyrpt = require('bcrypt');
const {check} = require("./Auth");
const users2 = require("../users2");
const chats = require("../chats");
//const { json } = require("body-parser");
const req = require("express/lib/request");
const res = require("express/lib/response");
let username; 
require("dotenv").config();

// GET (/)
router.get('/',(req,res)=>{
let token = req.cookies.jwt;
if(!token){
    res.render("index.ejs",{error:false});
}
else{
res.redirect("/homepage");
}
});

// Sign-Out Clear jwt
router.get("/sign-out",(req,res)=>{
res.clearCookie('jwt');
res.send("session ended");
});

router.get('/sign-up',(req,res)=>{
const token = req.cookies.jwt
if(!token){
    res.render("sign-up.ejs",{error:false});
}
else{
    res.redirect("/homepage");
}
});
router.get('/homepage',check,(req,res)=>{
    let ad = jwt.verify(req.cookies.jwt,process.env.secret); 
    username = ad;
    res.render('homepage.ejs',{data:{ad:ad.name,error:false}});
});

// LOGIN
router.post("/login",async(req,res)=>{
    let ad = req.body.name;
    try{
    let user1 = await User.findOne({name:ad})
    if(!user1){
        res.render("index.ejs",{error:"We Could Not Find The User"});
    }
    else{
        const ischeck = await bcyrpt.compare(req.body.password,user1.password);
    if(!ischeck){
        res.render("index.ejs",{error:"Password Is Wrong"});
    }
    else{
        const maxage = 2*60;
        const token = jwt.sign({name:req.body.name},process.env.secret,{
            expiresIn:maxage
        });
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxage*1000})
        res.redirect("/homepage");
    }
    }
}
catch(e){
    res.render("index.ejs",{error:"Please Check Your Username And Password And Try Again"});
}
});

// SIGN-UP
router.post("/sign-up",async(req,res)=>{
const user = new User(req.body);
try{
const post = await user.save();
let token = jwt.sign({name: req.body.name},process.env.secret,{expiresIn:120})
res.cookie('jwt',token,{httpOnly:true,maxAge:1000})
res.redirect("/homepage");
}
catch(e){
if(e.code!=11000){
    let error1 = e.message.substring(e.message.indexOf(':')+1);
    res.render("sign-up.ejs",{error:error1});
}
else{
    res.render("sign-up.ejs",{error:"This Name Is Already Exist"});
}
}
});

// CREATE-ROOM
router.post("/create-room",check,async(req,res)=>{
let ad = jwt.verify(req.cookies.jwt,process.env.secret);
if(req.body.memberamount>=2 && req.body.chatname!=''){
const chat = new chats(req.body);
await chat.save();
let Gonder = await bcyrpt.hash("başarılı",5);
await users2.updateOne({name:ad.name},{$push:{chat:chat._id}});
res.cookie('success',Gonder);
res.redirect("/create-room-s");
}
else{
    let Gonder2 = await bcyrpt.hash("hatalı",5);
    res.cookie('danger',Gonder2);
    res.redirect("/create-room-s");
}
});


// YOUR ROOMS
router.get("/your-rooms",check,async(req,res)=>{
let chatarray = [];
let ad = jwt.verify(req.cookies.jwt,process.env.secret); 
    username = ad;
try{
let mychats = await User.find({name:ad.name},{chat:1,_id:0});
let array = mychats[0].chat;
let send = await chats.find({_id:{$in:array}},{_id:1,chatname:1,memberamount:1});
for( var i = 0;i<array.length;i++){
    chatarray[i] = {
        "id":array[i],
        "chatname":send[i].chatname,
        "memberamount":send[i].memberamount
    }
}
res.json(chatarray);
}
catch{
    console.log("error");
}
});
//////////////////////////////////////////////////////////////////


// ALL ROOMS
router.get("/all-rooms",check,async(req,res)=>{
    let chatarray = [];
    try{
    let mychats = await User.find({},{chat:1,_id:0});
    let array = mychats[0].chat;
    let send = await chats.find({_id:{$in:array}},{_id:1,chatname:1,memberamount:1});
    for( var i = 0;i<array.length;i++){
        chatarray[i] = {
            "id":array[i],
            "chatname":send[i].chatname,
            "memberamount":send[i].memberamount
        }
    }
    res.json(chatarray);
    }
    catch{
        console.log("error");
    }
    });
////////////////////////////////////////////////////////////////


// middleware like something to prevent several form sending
router.get("/create-room-s",async(req,res)=>{
let ischeck1 = "";
if(req.cookies.danger){
    ischeck1 = await bcyrpt.compare("hatalı",req.cookies.danger);
    let ad1 = jwt.verify(req.cookies.jwt,process.env.secret);
    if(ischeck1){
        res.clearCookie("danger");
        res.render("homepage.ejs",{data:{ad:ad1.name,error:"Please Fill Both 2 Field",situation:'danger'}});
        }
        else{
            res.redirect("/");
        }
}
else if(!ischeck1&&!req.cookies.success){
    res.redirect("/");
}
else if(req.cookies.success&&!req.cookies.danger){
let ischeck = await bcyrpt.compare("başarılı",req.cookies.success);
let ad = jwt.verify(req.cookies.jwt,process.env.secret);
if(ischeck){
res.clearCookie("success");
res.render("homepage.ejs",{data:{ad:ad.name,error:"Room Was Created!",situation:'success'}})
}
else{
    res.redirect("/");
}
}
else{
    res.redirect("/");
}

})
////////////////////////////////////////////////////////////

// CHECK ROOM AVAILABILITY
router.post("/check-room",check,async()=>{
// let chat = await chats.find({_id:req.body.id},{userinroom:1,memberamount:1});
// if(chat.userinroom == memberamount){
//     res.json({"success":"false"});
// }
// else{
//     await chats.updateOne({_id:req.body.id},{});
//     res.json({"success":"true"});
// }
console.log(req.body.id);
});
////////////////////////////////////////////////////////////////

//sil 
router.get("/delete",async(req,res)=>{
    try{
   //await users2.remove({});
   let deneme = await users2.find({}).populate('chat');
    console.log(deneme);
    //res.send("deneme");
}
    catch{
        console.log("error");
    }
});












module.exports = router