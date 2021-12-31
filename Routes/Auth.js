const jwt = require('jsonwebtoken');
const req = require("express/lib/request");
const res = require("express/lib/response");
const check = function(req,res,next){
let token = req.cookies.jwt;
if(!token){
     res.render("index.ejs",{error:'Your Session Is Ended.'});
}
else if(token){
let control = jwt.verify(token,process.env.secret,(err,dtoken)=>{
    if(err){
        console.log("hata");
        res.redirect('/');
    }
    else{
       next();
    }
});
}
}
module.exports = {check};