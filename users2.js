const mongoose = require("mongoose");
const schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const users2 = new schema({
name:{
    type:String,
    required:[true,"Name Field Is Required"],
    unique:[true,"This Name Is Exist"],
    maxlength:[15,"You Can Not Enter A Name More Than 15 Character"]
}
,
password:{
    type:String,
    required:[true,"Password Field Is Required"]
},

chat:{type:schema.Types.ObjectId,ref:'chats'},

bannedchat:{type:schema.Types.ObjectId,ref:'chats'}
})
users2.pre('save',async function(next){
user = this
if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password,8)
}
next();
});
module.exports = mongoose.model('users',users2);