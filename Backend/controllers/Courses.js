const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary, deleteResourceFromCloudinary} = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration")
const CourseProgress = require("../models/CourseProgress")

exports.createCourse = async (req , res) =>{
    try{
        const {courseName, courseDescription, whatYouWillLearn, price, category, tag} = req.body;
        const thumbnail = req.files.thumbnailImage;
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail || !tag){
            return res.status(400).json({
                success : false,
                message : 'All fields are required'
            })
        }
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        if(!instructorDetails){
            return res.status(404).json({
                success : false,
                message : 'Instructor details not found'
            })
        }
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails){
            return res.status(404).json({
                success : false,
                message : 'category details not found'
            })
        }
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);


        
        const newCourse = await Course.create({
            courseName : courseName,
            courseDescription : courseDescription,
            instructor : instructorDetails._id,
            whatYouWillLearn : whatYouWillLearn,
            price : price,
            tag : tag ,
            category : categoryDetails._id,
            thumbnail : thumbnailImage.secure_url 
        });
        await User.findByIdAndUpdate(
            instructorDetails._id,
            { $push: { courses: newCourse._id } },
            { new: true }
        );

        await Category.findByIdAndUpdate({_id:categoryDetails._id},{
            courses : newCourse._id
        },{new:true});
        return res.status(200).json({
            success : true,
            message : 'Course created successfully',
            data : newCourse
        })
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success : false,
            message : 'Some error occured while creating course',
        })
    }
}

exports.showCourses = async (req, res) =>{
    try{
        const allCourses = await Course.find({},{courseName:true, price:true, instructor:true,thumbnail:true, ratingAndReview:true, studentsEnrolled : true}).populate("insstructor").exec();
        return res.status(200).json({
            success : true,
            message : 'All courses returned successfully',
            data : allCourses
        })
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success : false,
            message : 'Some error occured while returning courses'
        })
    }
}

exports.getCourseDetails = async (req , res) =>{
    try{
        const {courseId} = req.body;
        const courseDetails = await Course.findById(courseId).populate({
            path : "instructor",
            populate : {
                path : "additionalDetails"
            }
        }).populate("category")
          .populate("ratingAndReviews")
          .populate({
            path : "courseContent",
            populate : {
                path : "SubSection"
            }
          }).exec();
          if(!courseDetails){
            return res.status(400).json({
                success : false,
                message : "Could not find Course"
            })
          }

          return res.status(200).json({
                success : true,
                message : "Course details fetched successfully",
                data : courseDetails
            })
    }catch(error){
        console.error(error);
        return res.status(500).json({
                success : false,
                message : error.message
            })
    }
}
exports.getFullCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body
        const userId = req.user.id
        // console.log('courseId userId  = ', courseId, " == ", userId)
        const courseDetails = await Course.findOne({_id:courseId})
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "SubSection",
                },
            })
            .exec()
        let courseProgressCount = await CourseProgress.findOne({
            courseId: courseId,
            userId: userId,
        })
        //   console.log("courseProgressCount : ", courseProgressCount)

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: `Could not find course with id: ${courseId}`,
            })
        }
        // if (courseDetails.status === "Draft") {
        //   return res.status(403).json({
        //     success: false,
        //     message: `Accessing a draft course is forbidden`,
        //   });
        // }

        //   count total time duration of course
        let totalDurationInSeconds = 0
        courseDetails?.courseContent?.forEach((content) => {
            content?.SubSection?.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration)
                totalDurationInSeconds += timeDurationInSeconds
            })
        })
        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration,
                completedVideos: courseProgressCount?.completedVideos ? courseProgressCount?.completedVideos : [],
            },
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}



// ================ Edit Course Details ================
exports.editCourse = async (req, res) => {
    try {
        const { courseId } = req.body
        const updates = req.body
        const course = await Course.findById(courseId)

        if (!course) {
            return res.status(404).json({ error: "Course not found" })
        }

        // If Thumbnail Image is found, update it
        if (req.files) {
            // console.log("thumbnail update")
            const thumbnail = req.files.thumbnailImage
            const thumbnailImage = await uploadImageToCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
            )
            course.thumbnail = thumbnailImage.secure_url
        }

        // Update only the fields that are present in the request body
        // Update only the fields that are present in the request body
        Object.keys(updates).forEach((key) => {
            if (key === "tag" || key === "instructions") {
                course[key] = JSON.parse(updates[key])
            } else {
                course[key] = updates[key]
            }
        })


        // updatedAt
        course.updatedAt = Date.now();

        //   save data
        await course.save()

        const updatedCourse = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "SubSection",
                },
            })
            .exec()

        // success response
        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Error while updating course",
            error: error.message,
        })
    }
}



// ================ Get a list of Course for a given Instructor ================
exports.getInstructorCourses = async (req, res) => {
    try {
        // Get the instructor ID from the authenticated user or request body
        const instructorId = req.user.id

        // Find all courses belonging to the instructor
        const instructorCourses = await Course.find({ instructor: instructorId, }).sort({ createdAt: -1 })


        // Return the instructor's courses
        res.status(200).json({
            success: true,
            data: instructorCourses,
            // totalDurationInSeconds:totalDurationInSeconds,
            message: 'Courses made by Instructor fetched successfully'
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Failed to retrieve instructor courses",
            error: error.message,
        })
    }
}



// ================ Delete the Course ================
exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body

        // Find the course
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }

        // Unenroll students from the course
        const studentsEnrolled = course.studentsEnrolled
        for (const studentId of studentsEnrolled) {
            await User.findByIdAndUpdate(studentId, {
                $pull: { courses: courseId },
            })
        }

        // delete course thumbnail From Cloudinary
        await deleteResourceFromCloudinary(course?.thumbnail);

        // Delete sections and sub-sections
        const courseSections = course.courseContent
        for (const sectionId of courseSections) {
            // Delete sub-sections of the section
            const section = await Section.findById(sectionId)
            if (section) {
                const subSections = section.subSection
                for (const subSectionId of subSections) {
                    const subSection = await SubSection.findById(subSectionId)
                    if (subSection) {
                        await deleteResourceFromCloudinary(subSection.videoUrl) // delete course videos From Cloudinary
                    }
                    await SubSection.findByIdAndDelete(subSectionId)
                }
            }

            // Delete the section
            await Section.findByIdAndDelete(sectionId)
        }

        // Delete the course
        await Course.findByIdAndDelete(courseId)

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Error while Deleting course",
            error: error.message,
        })
    }
}