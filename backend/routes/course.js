const courseRouter = Router();
const { Router } = require('express')


// user auth middleware
const userMiddleware = require('../middleware/user')



//main course logic
const courseController = require('../Controller/courseControler.js')


courseRouter.post('/purchase', userMiddleware, courseController.purchaseCourse)

// courses toh dikhne chiye user ko, So this not need to be authenticated
courseRouter.get('/preview', courseController.previewCourse)


module.exports = courseRouter

