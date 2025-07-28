const Profile = require("../models/Profile");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const Course = require("../models/Course");
const Section = require("../models/section");
const SubSection = require("../models/SubSection");
const {convertSecondsToDuration} = require('../utils/secToDuration')

exports.updateProfile = async (req , res) =>{
    try{
    const {dateOfBirth="", about="", gender, contactNumber} = req.body;
    const id = req.user.id;
    if(!contactNumber || !gender || !id){
        return res.status(400).json({
            success : false, 
            message : 'All fields are required',
        })
    }
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();
    return res.status(200).json({
        success : true,
        message : 'Profile updated successfully',
    })
}catch(error){
    return res.status(500).json({
        success : false,
        message : 'Some error occurred while updating profile, please try again'
    })
}
}

exports.deleteAccount = async (req , res) =>{
    try{
        const {id} = req.user.id;
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success : false,
                message : 'Cannot find User to delete'
            })
        }
        await Profile.findByIdAndDelete({_id : userDetails.additionalDetails});
        await User.findByIdAndDelete({_id : id });
        
        return res.status(200).json({
            success : true,
            message : 'Account deleted successfully'
        })
    }catch(error){
        return res.status(500).json({
            success : false,
            message : 'Some error occurred while deleting account, please try again'
        })
    }
}

exports.getAllUserDetails = async (req , res) =>{
    try{
        const {id} = req.user.id;
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        
        return res.status(200).json({
            success : true,
            message : 'User Details returned successfully'
        })
    }catch(error){
        return res.status(500).json({
            success : false,
            message : 'Some error occurred while returning account details, please try again'
        })
    }
}

exports.updateUserProfileImage = async (req, res) => {
    try {
        const profileImage = req.files?.profileImage;
        const userId = req.user.id;

        // validation
        // console.log('profileImage = ', profileImage)

        // upload imga eto cloudinary
        const image = await uploadImageToCloudinary(profileImage,
            process.env.FOLDER_NAME, 1000, 1000);

        // console.log('image url - ', image);

        // update in DB 
        const updatedUserDetails = await User.findByIdAndUpdate(userId,
            { image: image.secure_url },
            { new: true }
        )
            .populate({
                path: 'additionalDetails'

            })

        // success response
        res.status(200).json({
            success: true,
            message: `Image Updated successfully`,
            data: updatedUserDetails,
        })
    }
    catch (error) {
        console.log('Error while updating user profile image');
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while updating user profile image',
        })
    }
}




// ================ Get Enrolled Courses ================
// exports.getEnrolledCourses = async (req, res) => {
//     try {
//         const userId = req.user.id

//     const userWithContent = await User.findOne({ _id: userId })
//       .populate({
//         path: "courses",
//         populate: {
//           path: "courseContent",
//         },
//       })
//       .exec()
//     console.log("Course content:", userWithContent.courses[0]?.courseContent)

//     // Step 3: Check the schema field names
//     if (userWithContent.courses[0]?.courseContent[0]) {
//       console.log(
//         "Available fields in courseContent:",
//         Object.keys(userWithContent.courses[0].courseContent[0].toObject()),
//       )
//     }

//      const userWithSubSections = await User.findOne({ _id: userId })
//       .populate({
//         path: "courses",
//         populate: {
//           path: "courseContent",
//           populate: {
//             path: "SubSection",
//           },
//         },
//       })
//       .exec()
//       console.log(userWithSubSections, 'userWithSubSec')

//         let userDetails = await User.findOne({ _id: userId })
//             .populate({
//                 path: "courses",
//                 populate: {
//                     path: "courseContent",
//                     populate: {
//                         path: "SubSection", 
//                     },
//                 },
//             })
//             .exec();
//         console.log(userDetails,"userDetails")
//         var SubsectionLength = 0
//         for (var i = 0; i < userDetails?.courses?.length; i++) {
//             let totalDurationInSeconds = 0
//             SubsectionLength = 0
//             for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
//                 totalDurationInSeconds += userDetails.courses[i].courseContent[
//                     j
//                 ].SubSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)

//                 userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds)
//                 SubsectionLength += userDetails.courses[i].courseContent[j].SubSection.length
//             }
//             console.log("3")
//             let courseProgressCount = await CourseProgress.findOne({
//                 courseID: userDetails.courses[i]._id,
//                 userId: userId,
//             })
//             console.log("4")
//             courseProgressCount = courseProgressCount?.completedVideos?.length || 0

//             if (SubsectionLength === 0) {
//                 userDetails.courses[i].progressPercentage = 100
//                 console.log("5")
//             } else {
//                 // To make it up to 2 decimal point
//                 const multiplier = Math.pow(10, 2)
//                 userDetails.courses[i].progressPercentage =
//                     Math.round((courseProgressCount / SubsectionLength) * 100 * multiplier) / multiplier
//                     console.log("6")
//             }
//         }
//         console.log("7")
//         if (!userDetails) {
//             return res.status(400).json({
//                 success: false,
//                 message: `Could not find user with id: ${userDetails}`,
//             })
//         }
//         console.log("8")
//         return res.status(200).json({
//             success: true,
//             data: userDetails.courses,
//         })
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         })
//     }
// }

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id

    // Get user with course IDs
    const user = await User.findOne({ _id: userId }).lean()

    if (!user || !user.courses || user.courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No courses found for user",
      })
    }

    // Manually populate courses
    const courses = await Course.find({ _id: { $in: user.courses } }).lean()

    // For each course, populate courseContent
    for (const course of courses) {
      if (course.courseContent && course.courseContent.length > 0) {
        // Get courseContent documents
        const courseContentDocs = await Section.find({
          _id: { $in: course.courseContent },
        }).lean()

        // For each courseContent, populate SubSection
        for (const content of courseContentDocs) {
          if (content.SubSection && content.SubSection.length > 0) {
            const subSections = await SubSection.find({
              _id: { $in: content.SubSection },
            }).lean()
            content.SubSection = subSections
          }
        }

        course.courseContent = courseContentDocs
      }

      // Calculate progress and duration
      let totalDurationInSeconds = 0
      let subsectionLength = 0

      if (course.courseContent) {
        for (const content of course.courseContent) {
          if (content.SubSection && Array.isArray(content.SubSection)) {
            totalDurationInSeconds += content.SubSection.reduce((acc, curr) => {
              return acc + (Number.parseInt(curr.timeDuration) || 0)
            }, 0)
            subsectionLength += content.SubSection.length
          }
        }
      }

      course.totalDuration = convertSecondsToDuration(totalDurationInSeconds)

      // Get progress
      const courseProgress = await Section.findOne({
        courseID: course._id,
        userId: userId,
      }).lean()

      const completedVideos = courseProgress?.completedVideos?.length || 0

      if (subsectionLength === 0) {
        course.progressPercentage = 100
      } else {
        const multiplier = Math.pow(10, 2)
        course.progressPercentage = Math.round((completedVideos / subsectionLength) * 100 * multiplier) / multiplier
      }
    }

    return res.status(200).json({
      success: true,
      data: courses,
    })
  } catch (error) {
    console.error("Error in manual populate:", error)
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


// ================ instructor Dashboard ================
exports.instructorDashboard = async (req, res) => {
    try {
        const courseDetails = await Course.find({ instructor: req.user.id })

        const courseData = courseDetails?.map((course) => {
            const totalStudentsEnrolled = course.studentsEnrolled.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price

            // Create a new object with the additional fields
            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                // Include other course properties as needed
                totalStudentsEnrolled,
                totalAmountGenerated,
            }

            return courseDataWithStats
        })

        res.status(200).json(
            {
                courses: courseData,
                message: 'Instructor Dashboard Data fetched successfully'
            },

        )
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server Error" })
    }
}




// ================ get All Students ================
exports.getAllStudents = async (req, res) => {
    try {
        const allStudentsDetails = await User.find({
            accountType: 'Student'
        })
            .populate('additionalDetails')
            .populate('courses')
            .sort({ createdAt: -1 });


        const studentsCount = await User.countDocuments({
            accountType: 'Student'
        });


        res.status(200).json(
            {
                allStudentsDetails,
                studentsCount,
                message: 'All Students Data fetched successfully'
            },
        )
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Error while fetching all students',
            error: error.message
        })
    }
}




// ================ get All Instructors ================
exports.getAllInstructors = async (req, res) => {
    try {
        const allInstructorsDetails = await User.find({
            accountType: 'Instructor'
        })
            .populate('additionalDetails')
            .populate('courses')
            .sort({ createdAt: -1 });


        const instructorsCount = await User.countDocuments({
            accountType: 'Instructor'
        });


        res.status(200).json(
            {
                allInstructorsDetails,
                instructorsCount,
                message: 'All Instructors Data fetched successfully'
            }
        )
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Error while fetching all Instructors',
            error: error.message
        })
    }
}