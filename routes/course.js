const {Router} = require('express')
const userMiddleware = require('../middleware/user')
const {PurchaseModel, CourseModel} = require('../db.js')
const courseRouter = Router();


courseRouter.post('/purchase', userMiddleware, async(req, res)=> {
    const userId = req.userId;

    const courseId = req.body;

    await  PurchaseModel.create({
        userId,
        courseId
    })

    res.json({
        message: "You have successfully purchased the course!!!!!"
    }) 
})

// courses toh dikhne chiye user ko, So this not need to be authenticated
courseRouter.get('/preview', async(req, res)=> {
    const courses = await CourseModel.find({})


res.json({courses})
})

 
module.exports =  courseRouter

