const user = require("../models/User");
const mailSender = require("../utils/mailSender");

exports.resetPasswordToken = async (req , res , next) => {
    try{
        const email = req.body.email;
        const user = await User.findOne({email}) ;

        if(!user) {
            return res.status(401).json({
                success : false,
                message : "Your email is not registered"
            })
        }
        const token = crypto.randomUUID();
        const updatedDetails = await User.findOneAndUpdate({email:email},{
            token : token,
            resetPasswordExpires : Date.now() + 5*60*1000
        },
    {new : true});
    const url = `http://localhost:4000/update-password/${token}`;
    await mailSender (email, "Password reset link" , `Here is your password reset link : ${url}`);
    return res.json({
        success : true,
        message : 'Email sent successfully on mail'
    })
    }catch(error){
        return res.status(500).json({
            success : false,
            message : "Something went wrong while creating reset password link"
        })
    }
}

exports.resetPassword = async (req,res) => {
    try{const {password, confirmPassword, token} = req.body;
    if(password != confirmPassword ){
        return res.json({
            success : false,
            message : "Password not matching"
        })
    }
    const userDetails = await User.findOne({token:token});
    if(!userDetails){
        return res.json({
            success : false,
            message : 'Invalid token'
        })
    }
    if(userDetails.resetPasswordExpires < Date.now()){
        return res.json({
            success : false,
            message : 'Token expired. Please regenerate'
        })
    }
    const hashedPassword = await bcrypt.hash(password,10);
    await User.findOneAndUpdate({token:token},{password : hashedPassword},{new:true});
    return res.status(200).json({
        success : true,
        message : 'Password reset successfully'
    })
} catch(error){
    return res.status(500).json({
        success : false,
        message : 'Some error occurred while reseting password'
    });
}
}