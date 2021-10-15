const jwt = require('jsonwebtoken');

let check = function(req,res,next){
let token = req.cookies.jwt;
if(token){
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
else{
    console.log("kullanıcı bulunamadı");
    res.redirect('/');
}
}
module.exports = {check};