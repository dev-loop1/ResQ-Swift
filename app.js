const express=require("express");
// const passport=require("passport");
const ejs=require("ejs");
const bodyparser=require("body-parser");
const {User,Hospital,unUser}=require("./database");

// const expressSession=require("express-session");
// const {initializingPassport,isAuthenticated}=require("./passport");
const {isAuthenticated}=require("./authentication");
// const {sendmail}=require("./otp");
const mongoose=require("mongoose");
const axios = require('axios');
const GeoPoint = require('geopoint');
const readline = require('readline');
const alert=require("alert");
// const popup = require("popups");
const notifier = require('node-notifier');
const {Navigator} = require("node-navigator");

const navigator = new Navigator();



const nodemailer=require("nodemailer");
const {google}=require("googleapis");

const clientid="406000613191-5i0umi055jch4sbbe77go2eeu35hduri.apps.googleusercontent.com"
const clientsecret="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"
const redirecturi="https://developers.google.com/oauthplayground"
// const refreshtoken="1//04P7ADSCskKftCgYIARAAGAQSNwF-L9IrytMHZSicOMO5zcUR2hqpNvXvAcQMwtMpIVxWv0XPMwQvVq5yOblZnqm-6K4TArxuEtM"
// const refreshtoken="1//04kQ6-xf1i1ddCgYIARAAGAQSNwF-L9IrULLHGrQ81v0NOkSeDQ4J498nUawrfA4vyUKpv3uawhmBxjXlQXE4vHEXdXz5ADR0mtY"
// const refreshtoken="1//04krA2yMDVvjHCgYIARAAGAQSNwF-L9IrWIogSo5gj4j4U02x1H6tNFCfBb-97dbXftMk5yM4LTUZo8YbExp3kE-qKLEF2jWsEfo"
const refreshtoken="1//04wass12KAOk6CgYIARAAGAQSNwF-L9IrXo2xUHRGNAdSYFZ2bgoC7o9Y2wuTfW-_jZi4mUWEVzFbp2fdkwfmva3qub_pqKIvxLQ"

const oauth2client=new google.auth.OAuth2(clientid,clientsecret,redirecturi)
oauth2client.setCredentials({refresh_token:refreshtoken})












const app=express();




// connectMongoose();
// initializingPassport(passport);



var useremail;
var hosemail;
var usernumber;
var sentotp;
var userdata;
var userornot=0;


app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({
    extended:true
}));
// app.use(express.static(__dirname + '/public'));






app.use(express.json());
app.use(express.urlencoded({extended:true}));




// app.use(expressSession({
//     secret:"secret",
//     resave:false,
//     saveUninitialized:false
// }));

// app.use(passport.initialize());
// app.use(passport.session());














async function sendmail(parameteremail){
    try{
        const accesstoken=await oauth2client.getAccessToken()
        const transport=nodemailer.createTransport({
            service:"gmail",
            auth:{
                type:"OAuth2",
                user:"yekkaladeviavinash@gmail.com",
                clientId: clientid,
                clientSecret: clientsecret,
                refreshToken:refreshtoken,
                accessToken:accesstoken
            },
        });
        const otp=Math.floor(100000+Math.random()*9000000);
        sentotp=otp;
        const mailoptions={
            from:'<yekkaladeviavinash@gmail.com>',
            to:parameteremail,
            subject:"ResQSwift ambulance booking",
            text:`Your OTP for booking ambulance in ResQ swift is: ${otp}. Please DONOT share with anyone.`,           
        };


        const result=await transport.sendMail(mailoptions);
        return result;
    }
    catch(error){
        console.log(error);
        return error;
    }
}










async function acceptmail(parameteremail,paraname,paranumber){
    try{
        const accesstoken=await oauth2client.getAccessToken()
        const transport=nodemailer.createTransport({
            service:"gmail",
            auth:{
                type:"OAuth2",
                user:"yekkaladeviavinash@gmail.com",
                clientId: clientid,
                clientSecret: clientsecret,
                refreshToken:refreshtoken,
                accessToken:accesstoken
            },
        });
        const mailoptions={
            from:'<yekkaladeviavinash@gmail.com>',
            to:parameteremail,
            subject:"Booking ACCEPTED",
            text:`Dear user,

We are pleased to confirm that your ambulance booking from ${paraname} has been successfully completed. The hospital team is on standby and ready to assist you. If you have any further questions or require immediate support, please do not hesitate to contact on ${paranumber}.
            
Thank you for choosing ResQ Swift. We are dedicated to providing you with the best possible care.
            
Regards
Team ResQ Swift
            `,
        };


        const result=await transport.sendMail(mailoptions);
        return result;
    }
    catch(error){
        console.log(error);
        return error;
    }
}






async function declinemail(parameteremail,paraname){
    try{
        const accesstoken=await oauth2client.getAccessToken()
        const transport=nodemailer.createTransport({
            service:"gmail",
            auth:{
                type:"OAuth2",
                user:"yekkaladeviavinash@gmail.com",
                clientId: clientid,
                clientSecret: clientsecret,
                refreshToken:refreshtoken,
                accessToken:accesstoken
            },
        });
        const mailoptions={
            from:'<yekkaladeviavinash@gmail.com>',
            to:parameteremail,
            subject:"Booking Declined",
            text:`We apologize, but we regret to inform you that your ambulance booking from ${paraname} cannot be fulfilled at this time due to the unavailability of our service. We understand the inconvenience this may cause. We kindly suggest considering booking an ambulance from another available hospital.

Thank you for choosing ResQ Swift. We are dedicated to providing you with the best possible care.
            
Regards
Team ResQ Swift
            `,       
        };


        const result=await transport.sendMail(mailoptions);
        return result;
    }
    catch(error){
        console.log(error);
        return error;
    }
}

// var userLat;
// var userLng;
//     navigator.geolocation.getCurrentPosition((success, error) =>{
//         if(error){ console.error(error);}
//         else 
//         {
//          userLat = success.latitude;
//          userLng = success.longitude;
//         // point1 = new GeoPoint(userLat, userLng);
//         // point2 = new GeoPoint(28.65195, 77.23149);
//         // console.log(point1.distanceTo(point2, true));
//         }
//     })
   











app.get("/",async function(req,res){
    res.render("home");
})
app.get("/register",function(req,res){
res.render("sendotp");
})
app.get("/register/sendotp/enterotp",function(req,res){
    res.render("enterotp");
})
app.get("/register/sendotp/enterotp/password",function(req,res){
    res.render("password");
})
app.get("/loginselect",function(req,res){
    res.render("loginselect");
})
app.get("/login",function(req,res){
    res.render("login");
})
app.get("/booknow",function(req,res){
    res.render("booknow");
})
app.get("/booknow/bookotp",function(req,res){
    res.render("bookotp");
})
app.get("/login/profile",function(req,res){         
    if(useremail==""){
        res.redirect("/login");
    }else{
        if(isAuthenticated(useremail)){
                res.render("profile",{
                    profilename:useremail
                });  
            }else{
                res.redirect("/login");
            } 
    }
})
app.get("/login/profile/booking",async function(req,res){
    if(useremail==""){
        res.redirect("/login");
    }else{
    if(isAuthenticated(useremail)){








        var userLat;
        var userLng;
        const hosp=await Hospital.find({});
    navigator.geolocation.getCurrentPosition((success, error) =>{
        if(error){ console.error(error);}
        else 
        {
            var distancearray=[];
         userLat = success.latitude;
         userLng = success.longitude;
        point1 = new GeoPoint(userLat, userLng);
        for(var i=0;i<hosp.length;i++){
            point2 = new GeoPoint(hosp[i].latitude, hosp[i].longitude);
            // console.log(point1.distanceTo(point2, true))
            distancearray.push({hospitalname:hosp[i].name,hospitaldistance:(point1.distanceTo(point2, true)).toFixed(2)});
        }
        distancearray.sort((a, b) => {
            return a.hospitaldistance - b.hospitaldistance;
        });
        // for(var i=0;i<distancearray.length;i++){
        //     console.log(distancearray[i].hospitalname+" "+distancearray[i].hospitaldistance);
        // }
        res.render("booking",{
            arr:distancearray
        });
        }
    })







    
    }else{
        res.redirect("/login");
    }
}
})

app.get("/login/profile/bookinghistory",async function(req,res){
    if(useremail==""){
        res.redirect("/login");
    }else{
    if(isAuthenticated(useremail)){
        const user=await User.findOne({email:useremail});
    res.render("userbookinghistory",{
        profilename:useremail,
        arr:user.userbookinghistory
    });
        }else{
            res.redirect("/login");
        }
    }
})

app.get("/logout",function(req,res){
    useremail="";
    usernumber="";
    hosemail="";
    res.redirect("/");
})

app.get("/firstaid",function(req,res){
    res.render("firstaid");
})

app.get("/booknow/bookotp/unprofile",function(req,res){
    res.render("unprofile",{
        profilename:useremail
    });
})

app.get("/booknow/bookotp/unbooking",async function(req,res){
    


    

    var userLat;
    var userLng;
    const hosp=await Hospital.find({});
navigator.geolocation.getCurrentPosition((success, error) =>{
    if(error){ console.error(error);}
    else 
    {
        var distancearray=[];
     userLat = success.latitude;
     userLng = success.longitude;
    point1 = new GeoPoint(userLat, userLng);
    for(var i=0;i<hosp.length;i++){
        point2 = new GeoPoint(hosp[i].latitude, hosp[i].longitude);
        // console.log(point1.distanceTo(point2, true))
        distancearray.push({hospitalname:hosp[i].name,hospitaldistance:(point1.distanceTo(point2, true)).toFixed(2)});
    }
    distancearray.sort((a, b) => {
        return a.hospitaldistance - b.hospitaldistance;
    });
    // for(var i=0;i<distancearray.length;i++){
    //     console.log(distancearray[i].hospitalname+" "+distancearray[i].hospitaldistance);
    // }
    res.render("unbooking",{
        arr:distancearray
    });
    }
})





})

app.get("/adminlogin",function(req,res){
    res.render("adminlogin");
})

app.get("/adminprofile",function(req,res){
    res.render("adminprofile");
})

app.get("/otplogin",function(req,res){
    res.render("otplogin");
})

app.get("/otplogin/otp",function(req,res){
    res.render("otploginverification");
})

// app.get("/otplogin/unuser",function(req,res){
//     res.render("unprofile",{
//         profilename:useremail
//     });
// })

app.get("/login/profile/booking/description",function(req,res){
    res.render("description");
})

app.get("/login/profile/booking/description/home",async function(req,res){
    const user=await User.findOne({email:useremail});
    user.userbookinghistory.push(userdata);
    user.save();
    const hospital=await Hospital.findOne({name:userdata.selectedhospital});
    // hospital.hospitalbookinghistory.push(userdata);
    hospital.currenthistory.push(userdata);
    hospital.save();
    res.redirect("/login/profile");
})

app.get("/booknow/bookotp/unbooking/undescription/home",async function(req,res){
    // if(userornot==1){
    //     const user=await User.findOne({email:useremail});
    // userdata.patientdescription=req.body.pdescription;
    // user.userbookinghistory.push(userdata);
    // user.save();
    // }else{
    //     const user=await unUser.findOne({email:useremail});
    //     userdata.patientdescription=req.body.pdescription;
    //     user.userbookinghistory.push(userdata);
    //     user.save();
    // }


    const user=await User.findOne({email:useremail});
    if(user){
        userdata.patientdescription=req.body.pdescription;
        user.userbookinghistory.push(userdata);
        user.save();
    }else{
        const unuser=await unUser.findOne({email:useremail});
            userdata.patientdescription=req.body.pdescription;
            unuser.userbookinghistory.push(userdata);
            unuser.save();
    }


    const hospital=await Hospital.findOne({name:userdata.selectedhospital});
    // hospital.hospitalbookinghistory.push(userdata);
    hospital.currenthistory.push(userdata);
    hospital.save();
    res.redirect("/booknow/bookotp/unprofile");
})

app.get("/booknow/bookotp/unbooking/undescription",function(req,res){
    res.render("undescription");
})

app.get("/booknow/bookotp/unbookinghistory",async function(req,res){
    // const user=await unUser.findOne({email:useremail});
    // res.render("unknownuserbookinghistory",{
    //     profilename:useremail,
    //     arr:user.userbookinghistory
    // });

    // if(userornot==1){
    //     const user=await User.findOne({email:useremail});
    // res.render("userbookinghistory",{
    //     profilename:useremail,
    //     arr:user.userbookinghistory
    // });
    // }else{
    //     const user=await unUser.findOne({email:useremail});
    // res.render("unknownuserbookinghistory",{
    //     profilename:useremail,
    //     arr:user.userbookinghistory
    // });
    // }

    const user=await User.findOne({email:useremail});
    if(user){
        res.render("userbookinghistory",{
        profilename:useremail,
        arr:user.userbookinghistory
    });
    }else{
            const unuser=await unUser.findOne({email:useremail});
    res.render("unknownuserbookinghistory",{
        profilename:useremail,
        arr:unuser.userbookinghistory
    });
    }
})

app.get("/hoslogin",function(req,res){
    res.render("hospitallogin");
})

app.get("/hoslogin/hosprofile",async function(req,res){
    const hospital=await Hospital.findOne({email:hosemail});
    res.render("hospitalprofile",{
        profilename:hosemail,
        arr:hospital.currenthistory
    });
})

app.get("/hoslogin/hosprofile/hoshistory",async function(req,res){
    const hospital=await Hospital.findOne({email:hosemail});
    res.render("hospitalbookinghistory",{
        profilename:hosemail,
        arr:hospital.hospitalbookinghistory
    });
})
// app.post("/register",async function(req,res){
//     const user=await User.findOne({username:req.body.username});
//     if(user){
//         return res.status(400).send("User already exists");
//     }else{
//         // const newuser=await User.create(req.body);
//         const newuser=new User({
//             name:req.body.name,
//             username:req.body.username,
//             password:req.body.password
//         })
//         newuser.save();
//         res.redirect("/");
//     }
// })

app.post("/register/sendotp",async function(req,res){
    const user=await User.findOne({email:req.body.useremail});
    if(user){
        return res.status(400).send("User already exists");
    }else{
        useremail=req.body.useremail;
        usernumber=req.body.usernumber;
        sendmail(req.body.useremail);
        res.redirect("/register/sendotp/enterotp")
    }
})
app.post("/register/sendotp/enterotp",function(req,res){
    if(sentotp == req.body.userotp){
        res.redirect("/register/sendotp/enterotp/password");
    }
    else{
        notifier.notify({
            title: 'Wrong OTP!',
            message: 'You have entered the wrong OTP!',
            sound: true,
            wait: true // Wait for user action (optional)
        });

        res.redirect("/register/sendotp/enterotp");
    }
})

app.post("/register/sendotp/enterotp/password",async function(req,res){   
        // const newuser=await User.create(req.body);
        if(req.body.userpassword==req.body.usercpassword){
            // const newuser=new User({
            //     email:useremail,
            //     number:usernumber,
            //     password:req.body.userpassword
            // })
            // newuser.save();
            // res.redirect("/");
            const unuser=await unUser.findOne({email:useremail});
            if(unuser){
                const newuser=new User({
                    email:useremail,
                    number:usernumber,
                    password:req.body.userpassword,
                    userbookinghistory:unuser.userbookinghistory
                })
                newuser.save();
                res.redirect("/");
            }else{
                const newuser=new User({
                email:useremail,
                number:usernumber,
                password:req.body.userpassword
            })
            newuser.save();
            res.redirect("/");
            }
        }
        // else{
        //     res.send("Both passwords are not matching");
        // }
})

app.post("/booknow",function(req,res){
    useremail=req.body.bookemail;
    sendmail(req.body.bookemail);
    res.redirect("/booknow/bookotp");
})

app.post("/booknow/bookotp",async function(req,res){
    if(sentotp == req.body.bookotp){
        // const unuser=await unUser.findOne({email:useremail});
        // if(!unuser){
        //     const newuser=new unUser({
        //         email:useremail
        //     })
        //     newuser.save();
        // }
        // res.redirect("/booknow/bookotp/unbooking");
        const user=await User.findOne({email:useremail});
        if(user){
            userornot=1;
        }else{
            const unuser=await unUser.findOne({email:useremail});
        if(!unuser){
            const newuser=new unUser({
                email:useremail
            })
            newuser.save();
        }
        }
        res.redirect("/booknow/bookotp/unbooking");
    }else{
        notifier.notify({
            title: 'Invalid OTP!',
            message: 'You have entered the wrong OTP',
            sound: true,
            wait: true // Wait for user action (optional)
        });

        res.redirect("/booknow/bookotp");
    }
})

app.post("/login",async function(req,res){
    const username=req.body.username;
    useremail=username;
        const user=await User.findOne({email:username});
        if(!user){
            notifier.notify({
                title: 'Wrong Details',
                message: 'You have entered the wrong credentials',
                sound: true,
                wait: true // Wait for user action (optional)
            });
    
            res.redirect("/login");
        }else if(user.password!=req.body.password){
            notifier.notify({
                title: 'Wrong Password',
                message: 'You have entered the wrong password',
                sound: true,
                wait: true // Wait for user action (optional)
            });
    
            res.redirect("/login");
        }else{
            res.redirect("/login/profile");
        }
    
})

app.post("/login/profile/booking",async function(req,res){
    const user=await User.findOne({email:useremail});

    function addZero(i) {
        if (i < 10) {i = "0" + i}
        return i;
      }
      
      const d = new Date();
      let h = addZero(d.getHours());
      let m = addZero(d.getMinutes());
      let s = addZero(d.getSeconds());
      let time = h + ":" + m + ":" + s;

    userdata={
        patientname:req.body.pname,
        patientage:req.body.page,
        patientgender:req.body.pgender,
        patientnumber:req.body.pnumber,
        selectedhospital:req.body.selectedhos,
        bookingemail:useremail,
        bookingdate:d.toDateString(),
        bookingtime:time,
        patientdescription:req.body.pdescription,
        status:req.body.status
    }
    // console.log(req.body.selectedhos);
    res.redirect("/login/profile/booking/description");
})

app.post("/login/profile/booking/description",async function(req,res){
    const user=await User.findOne({email:useremail});
    userdata.patientdescription=req.body.pdescription;
    user.userbookinghistory.push(userdata);
    user.save();
    const hospital=await Hospital.findOne({name:userdata.selectedhospital});
    // hospital.hospitalbookinghistory.push(userdata);
    hospital.currenthistory.push(userdata);
    hospital.save();
    res.redirect("/login/profile");
})

app.post("/adminlogin",function(req,res){
    if(req.body.adminname=="iamadmin@gmail.com"){
        if(req.body.adminpassword=="thisisadmin"){
            res.redirect("/adminprofile");
        }
    }
})

app.post("/adminprofile",function(req,res){
    if(req.body.hospassword==req.body.hoscpassword){
        const newuser=new Hospital({
            name:req.body.hosname,
            email:req.body.hosemail,
            number:req.body.hosnumber,
            latitude:req.body.hoslat,
            longitude:req.body.hoslng,
            password:req.body.hospassword
        })
        newuser.save();
        res.redirect("/adminprofile");
    }
})

app.post("/otplogin",async function(req,res){
    useremail=req.body.otploginemail;
    const unuser=await unUser.findOne({email:useremail});
        if(unuser){
            sendmail(req.body.otploginemail);
            res.redirect("/otplogin/otp");
        }else{
            notifier.notify({
                title: 'You dont have any previous bookings',
                message: 'People who have previous bookings can login through this.',
                sound: true,
                wait: true // Wait for user action (optional)
            });
    
            res.redirect("/otplogin");
        }
})

app.post("/otplogin/otp",async function(req,res){
    if(sentotp == req.body.otplogin){
        const unuser=await unUser.findOne({email:useremail});
            res.redirect("/booknow/bookotp/unprofile");
    }else{
        notifier.notify({
            title: 'Wrong OTP',
            message: 'You have entered the wrong OTP',
            sound: true,
            wait: true // Wait for user action (optional)
        });

        res.redirect("/otplogin/otp");
    }
})


app.post("/booknow/bookotp/unbooking",async function(req,res){
    const user=await unUser.findOne({email:useremail});

    function addZero(i) {
        if (i < 10) {i = "0" + i}
        return i;
      }
      
      const d = new Date();
      let h = addZero(d.getHours());
      let m = addZero(d.getMinutes());
      let s = addZero(d.getSeconds());
      let time = h + ":" + m + ":" + s;

    userdata={
        patientname:req.body.pname,
        patientage:req.body.page,
        patientgender:req.body.pgender,
        patientnumber:req.body.pnumber,
        selectedhospital:req.body.selectedhos,
        bookingemail:useremail,
        bookingdate:d.toDateString(),
        bookingtime:time,
        patientdescription:req.body.pdescription,
        status:req.body.status
    }
    // console.log(req.body.selectedhos);
    res.redirect("/booknow/bookotp/unbooking/undescription");
})

app.post("/booknow/bookotp/unbooking/undescription",async function(req,res){
    // if(userornot==1){
    //     const user=await User.findOne({email:useremail});
    // userdata.patientdescription=req.body.pdescription;
    // user.userbookinghistory.push(userdata);
    // user.save();
    // }else{
    //     const user=await unUser.findOne({email:useremail});
    //     userdata.patientdescription=req.body.pdescription;
    //     user.userbookinghistory.push(userdata);
    //     user.save();
    // }
    
    const user=await User.findOne({email:useremail});
    if(user){
        userdata.patientdescription=req.body.pdescription;
        user.userbookinghistory.push(userdata);
        user.save();
    }else{
        const unuser=await unUser.findOne({email:useremail});
            userdata.patientdescription=req.body.pdescription;
            unuser.userbookinghistory.push(userdata);
            unuser.save();
    }


    // console.log("inside"+userdata.selectedhospital);
    const hospital=await Hospital.findOne({name:userdata.selectedhospital});
    // hospital.hospitalbookinghistory.push(userdata);
    hospital.currenthistory.push(userdata);
    hospital.save();
    res.redirect("/booknow/bookotp/unprofile");
})

app.post("/hoslogin",async function(req,res){
    const hosname=req.body.hosname;
    hosemail=hosname;
        const user=await Hospital.findOne({email:hosname});
        if(!user){
            notifier.notify({
                title: 'Wrong details',
                message: 'You have entered the wrong details.',
                sound: true,
                wait: true // Wait for user action (optional)
            });
    
            res.redirect("/hoslogin");
        }else if(user.password!=req.body.password){
            notifier.notify({
                title: 'Wrong password',
                message: 'You have entered the wrong password.',
                sound: true,
                wait: true // Wait for user action (optional)
            });
    
            res.redirect("/hoslogin");
        }else{
            res.redirect("/hoslogin/hosprofile");
        }
})

// app.post("/hoslogin/hosprofile",async function(req,res){
//     // const user=await Hospital.findOne({email:hosemail});
//     // const delname=req.body.delname;
//     // const delnumber=req.body.delnumber;
//     // var index=0;
//     // for(var i=0;i<user.currenthistory.length;i++){
//     //     if((user.currenthistory[i].patientnumber==delnumber)&&(user.currenthistory[i].patientname==delname)){
//     //         index=i;
//     //     }
//     // }
//     // if (index > -1) { // only splice array when item is found
//     //   user.currenthistory.splice(index, 1); // 2nd parameter means remove one item only
//     // }

// const user=await Hospital.findOne({email:hosemail});
//     const delname=req.body.delname;
//     const delnumber=req.body.delnumber;
//     var index=0;
//     for(var i=0;i<user.currenthistory.length;i++){
//         if((user.currenthistory[i].patientnumber==delnumber)&&(user.currenthistory[i].patientname==delname)){
//             index=i;
//         }
//     }
    

 
    
     
    
//     let removed = user.currenthistory.splice(index, 1)
//      user.save();
    
//      res.redirect("/hoslogin/hosprofile");
   

// })

app.post("/hoslogin/hosprofile/accept",async function(req,res){
    const user=await Hospital.findOne({email:hosemail});

    acceptmail(req.body.acceptemail,user.name,user.number);

    const delname=req.body.delname;
    const delnumber=req.body.delnumber;
    var index=0;
    for(var i=0;i<user.currenthistory.length;i++){
        if((user.currenthistory[i].patientnumber==delnumber)&&(user.currenthistory[i].patientname==delname)){
            index=i;
        }
    }
    user.currenthistory[index].status="Accepted";
    user.hospitalbookinghistory.push(user.currenthistory[index]);
    
 
    
     
    
    let removed = user.currenthistory.splice(index, 1)
     user.save();
    res.redirect("/hoslogin/hosprofile");
})

app.post("/hoslogin/hosprofile/decline",async function(req,res){
    const user=await Hospital.findOne({email:hosemail});
    declinemail(req.body.declineemail,user.name);
    const delname=req.body.delname;
    const delnumber=req.body.delnumber;
    var index=0;
    for(var i=0;i<user.currenthistory.length;i++){
        if((user.currenthistory[i].patientnumber==delnumber)&&(user.currenthistory[i].patientname==delname)){
            index=i;
        }
    }
    
    user.currenthistory[index].status="Denied";
    user.hospitalbookinghistory.push(user.currenthistory[index]);
   
    
     
    
    let removed = user.currenthistory.splice(index, 1)
     user.save();
    res.redirect("/hoslogin/hosprofile");
})











app.listen(3000,function(req,res){
    console.log("Running on port 3000");
})