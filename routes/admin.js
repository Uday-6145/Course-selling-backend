const express = require('express')
const {AdminModel} = require('../db')
const {CourseModel} = require('../db')
const adminRouter = express.Router()
const jwt = require('jsonwebtoken')
const adminMiddleware = require('../middleware/admin')

adminRouter.post('/signup', async(req, res)=> {
    const {email, password, firstName, lastName} = req.body //TODO: adding zod validation
        //TODO: hash the password so plain text password not stored in db.

        //TODO: Put inside a try catch block
        await AdminModel.create({
            email: email,
            password : password,
            firstName: firstName,
            lastName: lastName
        })

        res.json("SignUp Succedded")
    res.json("SignUp endpoint")
})

adminRouter.post('/signin', async(req, res)=> {
    const {email, password} = req.body
        //TODO: ideally password should be hashed hence you cant compare user provided provided
        const admin = await AdminModel.findOne({
            email: email,
            password: password
        })

        if(admin){
            const token = jwt.sign({
                id: admin._id
            }, process.env.JWT_ADMIN_SECRET)

            res.json({
                token: token
            })
        }
        else{
            res.status(403).json({
                message: "Incorrect credential!!!"
            })
        }
    res.send("SignIn endpoint")
})

adminRouter.post('/course', adminMiddleware, async(req, res)=> {
    const adminId = req.adminId


    const {title, description, imageUrl, price} = req.body;
    const course = await CourseModel.create({
        title, description, imageUrl, price, creatorId: adminId
    })


    res.json({
        message: "Course created",
        courseId: course._id
    })
})

adminRouter.put('/course', adminMiddleware,  async(req, res)=> {
    const adminId = req.adminId

    const {title, description, imageUrl, price, courseId} = req.body;
    const course = await CourseModel.updateOne({
        _id: courseId
    },{
        title, description, imageUrl, price
    })
    res.json({
        message: "Course Updated",
        courseId: course._id
    })
})

adminRouter.get('/course/bulk', (req, res)=> {
    res.send("give all the courses that admin has created")
})


module.exports = adminRouter