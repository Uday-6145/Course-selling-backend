const express = require('express')

//create a router
const adminRouter = express.Router()


//these are middleware
const adminMiddleware = require('../middleware/adminMiddleware')
const adminController = require('../Controller/adminController')



//these are different routes
adminRouter.post('/signup', adminController.adminSignUp)

adminRouter.post('/signin', adminController.adminSignIn)

adminRouter.post('/course', adminMiddleware, adminController.createCourses)

adminRouter.put('/course', adminMiddleware, adminController.updateCourse)

adminRouter.get('/course/bulk', adminMiddleware, adminController.getAllCourses)

adminRouter.delete('/course', adminMiddleware, adminController.deleteCourse)


module.exports = adminRouter