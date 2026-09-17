const bcrypt = require('bcrypt')
const AdminModel = require('../models/adminModel.js')
const CourseModel = require('../models/courseModel.js')
const bcrypt = require('bcrypt')
const zod = require('zod')
const jwt = require('jsonwebtoken')


const adminSignUp = async(req, res) => {
    const {email, password, firstname, lastname} = req.body


    //here we are checking that admin send the data in valid formate through zod
    const schema = zod.object({
        email: zod.email().string().min(5),
        password: zod.string().min(6),
        firstname:zod.string().min(3),
        lastname: zod.string().min(3)
    })

    const result = schema.safeParse(req.body)
    if(!result.success){
        res.json({
            message: "Incorrect data formate",
            error: result.error
        })
    }



    const hashedPassword = bcrypt.hash(password, 10)

    try{
        // first time admin created
        await AdminModel.create({
            email,
            password: hashedPassword,
            firstname,
            lastname
        })

        res.status(201).send("Signup successful!")
    }
    catch(err){
        res.status(400).json("Admin already exists!")
    }
}


const adminSignIn = async(req, res) => {
    const {email, password} = req.body;

    const schema = zod.object({
        email: zod.email().string(),
        password: zod.string().min(6)
    })

    const result = schema.safeParse(req.body)

    if(!result.success){
        res.json({
            message: "Incorrect data formate",
            error: result.error
        })
    }

    const admin = await AdminModel.findOne({
        email: email
    })

    if(!admin){
        res.status(403).json({
            message: "Invalid Credential!!"
        })
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if(isPasswordMatch){
        const token = jwt.sign({id: admin._id}, process.env.JWT_ADMIN_SECRET)
        res.status(200).json({token: token})
    }
    else{
        res.status(403).json({ message: "Invalid Credentials!" });
    }



}


const createCourses = async(req, res) => {
    const {title, description, imageUrl, price} = req.body;

    const schema = zod.object({
        title: zod.string().min(3),
        description: zod.string().min(10),
        imageUrl: zod.url().string(),
        price: zod.number().positive()
    })

    const result = schema.safeParse(req.body)
    if(!result.success){
        res.json({
            message: "Incorrect data formate",
            error: result.error
        })
    }


    const course = await CourseModel.create({
        title,
        description,
        imageUrl,
        price,
        creatorId: req.adminId
    })

    res.status(201).json({ message: "Course created!", courseId: course._id });

}


const updateCourse = async(req, res) => {
    const { courseId, title, description, imageUrl, price } = req.body;

    const schema = zod.object({
        courseId: zod.string().min(5),
        title: zod.string().min(3).optional(),
        description: zod.string().min(5).optional(),
        imageUrl: zod.url().string().optional(),
        price: zod.number().positive().optional(),
    })
    const result = schema.safeParse(req.body);
    if(!result.success){
        res.json({
            message: "Incorrect data formate",
            error: result.error
        })
    }



    const course = await CourseModel.findOne({
        _id: courseId,
        creatorId: req.adminId
    })

    if(!course){
        res.status(404).json({ message: "Course not found!" });
    }

    await CourseModel.updateOne({_id: courseId, creatorId: req.adminId}, {
            title: title || course.title,
            description: description || course.description,
            imageUrl: imageUrl || course.imageUrl,
            price: price || course.price,
    })

    res.status(200).json({ message: "Course updated!" });

}


const deleteCourse = async(req, res) => {
    const {courseId} = req.body;

    const schema = zod.object({
        courseId: zod.string().min(5)
    })

    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.json({ message: "Incorrect data format", error: result.error });
    }



    const course = await CourseModel.findOne({ _id: courseId, creatorId: req.adminId });

    if (!course) {
        return res.status(404).json({ message: "Course not found!" });
    }

    await CourseModel.deleteOne({ _id: courseId, creatorId: req.adminId });
    res.status(200).json({ message: "Course deleted!" });

}

const getAllCourses = async(req, res) => {
    const courses = await CourseModel.find({ creatorId: req.adminId });
    res.status(200).json({ courses });
}

module.exports = {
    adminSignUp, adminSignIn, createCourses, getAllCourses,  updateCourse, deleteCourse
}