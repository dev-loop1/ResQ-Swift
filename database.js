// const mongoose=require("mongoose");


// exports.connectMongoose=()=>{
//     mongoose.connect("mongodb://127.0.0.1:27017/testdb",{useNewUrlParser:true});
// }

// // const userschema=new mongoose.Schema({
// //     name:String,
// //     username:String,
// //     password:String
// // });

// const userschema=new mongoose.Schema({
//     email:String,
//     number:Number,
//     password:String,
//     userbookinghistory:Array
// });

// const User=new mongoose.model("user",userschema);

// exports.User=mongoose.model("User",userschema);



const mongoose=require("mongoose");

    

const db1=mongoose.createConnection("mongodb://127.0.0.1:27017/knowndb",{useNewUrlParser: true});
const db2=mongoose.createConnection("mongodb://127.0.0.1:27017/hospitaldb",{useNewUrlParser: true});
const db3=mongoose.createConnection("mongodb://127.0.0.1:27017/unknowndb",{useNewUrlParser: true});
// const userschema=new mongoose.Schema({
//     name:String,
//     username:String,
//     password:String
// });

const knownschema=new mongoose.Schema({
    email:String,
    number:Number,
    password:String,
    userbookinghistory:Array
});

const hospitalschema=new mongoose.Schema({
    name:String,
    email:String,
    number:Number,
    latitude:Number,
    longitude:Number,
    password:String,
    currenthistory:Array,
    hospitalbookinghistory:Array
});

const unknownschema=new mongoose.Schema({
    email:String,
    userbookinghistory:Array
});


const User=db1.model("user",knownschema);
const Hospital=db2.model("hospital",hospitalschema);
const unUser=db3.model("unuser",unknownschema);

module.exports={User,Hospital,unUser};









// exports.User=mongoose.model("User",userschema);
// exports.Hospital=mongoose.model("Hospital",hospitalschema);