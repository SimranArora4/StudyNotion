const {instance} = require("../config/razorpay");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const Course = require("../models/Course");
const {courseEnrollmentEmail} = require("../mail/template/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto")
const CourseProgress = require('../models/CourseProgress');
const {paymentSuccessEmail} = require("../mail/template/paymentSuccessEmail")

exports.capturePayment = async (req, res) =>{
    const {coursesId} = req.body;
    const userId = req.user.id;
    if(coursesId?.length === 0){
        return res.json({success:false, message: "Please provide course Id"});
    }
    let totalAmount = 0 ;
    for(const course_id of coursesId ){
        let course;
        try{
            course = await Course.findById(course_id);
            if(!course){
                return res.status(200).json({success:false , message:"Could not find course"});
            }
            const uid = new mongoose.Types.ObjectId(userId);
            if(course?.studentsEnrolled?.includes(uid)){
                return res.status(200).json({
                    success : false,
                    message : "Student is already enrolled"
                });
            }
            totalAmount+=course?.price;
        }catch(error){
            return res.status(500).json({
                success : false,
                message : error.message
            });
        }
    }
    const currency = "INR";
    const options = {
        amount: totalAmount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
    }

    try{
        const paymentResponse = await instance?.orders?.create(options);
        return res.status(200).json({
            success: true,
            message: {
                id: paymentResponse.id,
                amount: paymentResponse.amount,
                currency: paymentResponse.currency,
            },
        });
    }catch(error){
        return res.status(500).json({
            success : false, 
            message : "Could not initiate order",
        })
    }
}

exports.verifyPayment = async(req, res) =>{
    const razorpay_order_id = req?.body?.razorpay_order_id;
    const razorpay_payment_id = req?.body?.razorpay_payment_id;
    const razorpay_signature = req?.body?.razorpay_signature;
    const courses = req?.body?.coursesId;
    const userId = req?.user?.id;

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId){
        return res.status(200).json({
            success : false,
            message : "Your Payment has failed "
        })
    }
    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256" ,process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex");
    if(expectedSignature === razorpay_signature){
        await enrollStudents(courses, userId , res);
        return res.status(200).json({
            success : true,
            message : "Payment Verified"
        })
    }
    return res.status(500).json({success : false,message : "Payment failed"});
}


const enrollStudents = async (courses , userId, res) =>{
    if(!courses || !userId){
        return res.status(400).json({
            success : false,
            message : "Please provide data for courses and user id"
        });
    }
    try{
        for(const courseId of courses){
        const enrolledCourse = await Course.findByIdAndUpdate({_id : courseId}, {$push : {studentsEnrolled:userId}}, {new:true});
        if(!enrolledCourse){
            return res.status(500).json({
                success : false,
                message : "Course not Found"
            })
        }
        const courseProgress = await CourseProgress.create({
            courseID : courseId,
            userId : userId,
            completedVideos : []
        })
        const enrolledStudent = await User.findByIdAndUpdate(userId,{
            $push : {
                courses : courseId ,
                courseProgress : courseProgress
            }
        }, {new:true})

        const emailResponse = await mailSender(
            enrolledStudent.email,
           `Successfully Enrolled into ${enrolledCourse.courseName}`,
           courseEnrollmentEmail(enrolledCourse.courseName , `${enrolledStudent.firstName}`)
        )
        // console.log("Email sent successfully", emailResponse.response)
    }
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

exports.sendPaymentSuccessEmail = async(req ,res)=>{
    const {orderId, paymentId, amount} = req.body;
    const userId = req?.user?.id;

    if(!orderId || !paymentId || !userId || !amount){
        return res.status(400).json({success:false, message:"Please provide all fields"});
    }

    try{
        const enrolledStudent = await User.findById(userId);
        await mailSender(enrolledStudent?.email, "Payment Recieved", paymentSuccessEmail(`${enrolledStudent?.firstName}`,
            amount/100, orderId, paymentId)
        )
    }catch(error){
        console.log("error in sending mail", error);
        return res.status(500).json({success:false, message:"Could not send email"});
    }
}

// exports.capturePayment = async (req , res) =>{
//     try{
//         const {courseId} = req.body;
//         const userId = req.user.id; 
//         if(!courseId){
//             return res.json({
//                 success : false,
//                 message : 'Provide valid course Id'
//             })
//         };
//         let course;
//         try{
//             course = await Course.findById(courseId);
//             if(!course){
//                 return res.json({
//                     success : false,
//                     message : 'Could not find the course'
//                 })
//             }

//             const uid = new mongoose.Types.ObjectId(userId);
//             if(course.studentsEnrolled.includes(uid)){
//                 return res.status(200).json({
//                     success : false,
//                     message : 'User already enrolled in this course'
//                 })
//             }
//         }catch(error){
//             console.error(error);
//             return res.json({
//                 success : false,
//                 message : error.message
//             })
//         }
//         const amount = course.price;
//         const currency = "INR";
//         const options = {
//             amount : amount * 100,
//             currency,
//             receipt : Math.random(Date.now().toString()),
//             notes : {
//                 courseId : courseId,
//                 userId : userId,
//             }
//         };
//         try{
//             const paymentResponse = await instance.orders.create(options);
//             console.log(paymentResponse);
//             return res.status(200).json({
//                 success : true,
//                 courseName : course.courseName,
//                 courseDescription : course.courseDescription,
//                 thumbnail : course.thumbnail,
//                 orderId : paymentResponse.id,
//                 currency : paymentResponse.currency,
//                 amount : paymentResponse.amount,
//             })
//         }catch(error){
//             return res.status(500).json({
//                 success : false,
//                 message : 'Could not initiate order',
//             })
//         }
        
//     }catch(error){
//         return res.status(500).json({
//             success : false,
//             message : error.message
//         })
//     }
// }

// exports.verifySignature = async (req , res) =>{
//     const webhookSecret = "12345678";
//     const signature = req.headers("x-razorpay-signature");
//     const shasum = crypto.createHmac("sha256",webhookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");
//     if(signature===digest){
//         console.log("Payment is authorized");
//         const {courseId, userId} = req.body.payload.payment.entity.notes;
//         try{
//             const enrolledCourse = await Course.findByIdAndUpdate({_id : courseId},{$push:{studentsEnrolled:userId}},{new:true});
//             if(!enrolledCourse){
//                 return res.status(500).json({
//                     success : false,
//                     message : 'Course not found',
//                 })
//             }
//             console.log(enrolledCourse);
//             const enrolledStudent = await User.findByIdAndUpdate({_id:userId},{
//                 $push : {
//                     courses : courseId
//                 }
//             },{new:true});
//             console.log(enrolledStudent);

//             // send confirmation mail 
//             const emailResponse = await mailSender(enrolledStudent.email, "Congratualations you are successfully enrolled", "You have successfully enrolled to a new course");
//             console.log(emailResponse);
//              return res.status(200).json({
//                 success : true,
//                 message : 'Enrolled in the course'
//             })
//         }catch(error){
//             return res.status(500).json({
//                 success : false,
//                 message : error.message
//             })
//         }
//     }else{
//         return res.status(400).json({
//             success : false,
//             message : 'Signature not verified'
//         })
//     }
// }