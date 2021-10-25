const mongoose = require('mongoose');
const schema = mongoose.Schema;

const chats = new schema({
chatname:{
    type:String,
    required:true
},
memberamount:{
    type:Number,
    required:true
},
chatid:{
    type:Number
},
chatowner:{
    type:String
}
});
module.exports = mongoose.Model("chats",chats);