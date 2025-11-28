const {User}=require("./database");

exports.isAuthenticated=async (useremail)=>{
    const user=await User.findOne({email:useremail});
    if(!user){
        return 0;
    }else{
        return 1;
    }
}