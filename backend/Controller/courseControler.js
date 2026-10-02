const CourseModel = require("../models/courseModel")
const PurchaseModel = require('../models/purchaseModel')


//purchase a course
const purchaseCourse = async (req, res) => {

    const userId = req.userId;
    const courseId = req.body.courseId;

    if (!courseId) {
        return res.status(400).json({
            message: "Please provide a courseId",
        });
    }


    try {
        //check if the user have already purchase the course
        const existingPurchase = await PurchaseModel.findOne({
            userId: userId,
            courseId: courseId
        });

        if (existingPurchase) {
            return res.status(400).json({
                message: "You have already purchased this course!",
            })
        }


        //create a new purchase entry
        await PurchaseModel.create({
            userId,
            courseId,
        })

        res.status(201).json({
            message: "Course purchased successfully!",
        })

    }
    catch (err) {
        res.status(500).json({
            message: "An error occurred while processing the purchase",
            error: err.message,
        });
    }
}


//course preview
const previewCourse = async (req, res) => {

    try {
        const courses = await CourseModel.find({})
        res.status(200).json({
            courses
        })
    }
    catch (err) {
        res.status(500).json({
            message: "An error occurred while fetching courses",
            error: err.message,
        });

    }


}

module.exports = { previewCourse, purchaseCourse }
