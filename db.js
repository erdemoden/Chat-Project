const mongoose = require('mongoose');

module.exports = () =>{
    mongoose.connect("mongodb+srv://erdemoden:elmayiyen5@movie-api.icdyd.mongodb.net/SecondDatabase?retryWrites=true&w=majority")
    mongoose.connection.on('open',()=>{
        console.log("Bağlandık");
    });
    mongoose.connection.on('error',()=>{
        console.log("error");
    });
    mongoose.Promise = global.Promise;
}