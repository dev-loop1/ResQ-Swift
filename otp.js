const nodemailer=require("nodemailer");
const {google}=require("googleapis");

const clientid= process.env.GOOGLE_CLIENT_ID;
const clientsecret=process.env.GOOGLE_CLIENT_SECRET;
const redirecturi="https://developers.google.com/oauthplayground"
const refreshtoken= process.env.GOOGLE_REFRESH_TOKEN;
const oauth2client=new google.auth.OAuth2(clientid,clientsecret,redirecturi)
oauth2client.setCredentials({refresh_token:refreshtoken})

const otp=require("./app");


exports.sendmail=async (parameteremail)=>{
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
        // const otp=Math.floor(100000+Math.random()*9000000);
        
        const mailoptions={
            from:'<yekkaladeviavinash@gmail.com>',
            to:parameteremail,
            subject:"Hello from avinash",
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





// sendmail(myemail).then(result=> console.log("Email sent"))
// .catch(error => console.log(error.message));