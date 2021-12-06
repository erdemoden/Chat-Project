const express = require("express")
const router = express.Router();
const User = require('../users2');
const jwt = require('jsonwebtoken');
const { rawListeners } = require("../users2");
const bcyrpt = require('bcrypt');
const {check} = require("./Auth");
const users2 = require("../users2");
const chats = require("../chats");
const { json } = require("body-parser");
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
let Gonder = await bcyrpt.hash("başarılı",8);
await users2.updateOne({name:ad.name},{$push:{chat:chat._id}});
res.cookie('success',Gonder);
res.redirect("/create-room-s");
}
else{
    res.render("homepage.ejs",{data:{ad:ad.name,error:"Please Fill Both 2 Input Field!",situation:'danger'}});
}
// res.json({"Tamam":"Oldu"});
//res.render("homepage.ejs",{data:{ad:username,error:"Room Was Created!",situation:'success'}});
});


// YOUR ROOMS
router.get("/your-rooms",async(req,res)=>{
try{
let mychats = await User.find({},{chat:1,_id:0});
let array = mychats[0].chat;
res.send(mychats[0].chat);
console.log(array);
}
catch{
    console.log("error");
}
});

router.get("/create-room-s",(req,res)=>{
let ischeck = bcyrpt.compare(req.cookies.success,'başarılı');
let ad = jwt.verify(req.cookies.jwt,process.env.secret);
if(req.cookies.success){
res.clearCookie("success");
res.render("homepage.ejs",{data:{ad:ad.name,error:"Room Was Created!",situation:'success'}})
}
else{
    res.redirect("/");
}
})




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