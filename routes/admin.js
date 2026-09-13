const express = require('express')
const AdminModel = require('../db')
const adminRouter = express.Router()


adminRouter.post('/signup', (req, res)=> {
    res.json("SignUp endpoint")
})

adminRouter.post('/signin', (req, res)=> {
    res.send("SignIn endpoint")
})

adminRouter.post('/course', (req, res)=> {
    res.send("Course creation endpoint")
})

adminRouter.put('/course', (req, res)=> {
    res.send("Course updation endpoint")
})

adminRouter.get('/course/bulk', (req, res)=> {
    res.send("give all the courses that admin has created")
})


module.exports = adminRouter