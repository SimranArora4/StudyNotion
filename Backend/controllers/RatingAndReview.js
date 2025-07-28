const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");

exports.createRatingAndReview = async (req , res) =>{
    try{
        const { rating, review, courseId} = req.body;
        const userId = req.user.id;

        const courseDetails = await Course.findById({_id : courseId, studentsEnrolled : {$elemMatch : {$eq : userId}}});
        if(!courseDetails){
            return res.status(404).json({
            success : false,
            message : 'Student is not enrolled in the course'
        })
        }
        const alreadyReviewed = await RatingAndReview.findOne({
            user:userId,
            course : courseId
        });
        if(alreadyReviewed){
            return res.status(403).json({
                success : false,
                message : 'Course is already reviewed by user'
            })
        }
        ratingReview = await RatingAndReview.create({
            user : userId,
            rating : rating,
            review : review,
            course : courseId
        });
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,{
            $push : {
                ratingAndReviews : ratingReview._id,
            }
        },{new:true})
        return res.status(200).json({
            success : true,
            message : 'Rating and Review created successfully'
        })
        console.log(updatedCourseDetails);
    }catch(error){
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

exports.getAverageRating = async (req , res) =>{
    try{
        const courseId = req.body.courseId;
        const result = await RatingAndReview.aggregate([
            {
                $match : {
                    course : new mongoose.Types.ObjectId(courseId),
                },
            },{
                $group : {
                    _id : null,
                    averageRating : {$avg : "$rating"},
                }
            }
        ])
        if(result.length > 0){
            return res.status(200).json({
                success : true,
                averageRating : result[0].averageRating,

            })
        } else{
            return res.status(200).json({
                success : true,
                message : 'Average rating is 0, no ratings given till now ',
                averageRating : 0,

            })
        }
    }catch(error){
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

exports.getAllRating = async (req , res) =>{
    try{
        allReviews = await RatingAndReview.find({})
                                                    .sort({rating : "desc"})
                                                    .populate({
                                                        path : "user",
                                                        select : "firstName lastName email image"
                                                    })
                                                    .populate({
                                                        path : "course",
                                                        select : "courseName"
                                                    })
                                                    .exec();
        
        return res.status(200).json({
            success : true,
            message : 'Ratings returned successfully',
            data : allReviews
        })
    }catch(error){
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}