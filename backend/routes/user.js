//here we created a user route
const { Router } = require('express')
const userRouter = Router();


//this is auth middleware
const userMiddleware = require('../middleware/userMiddleware');


//this is user controller
const userController = require('../Controller/userController.js')



//these are routes endpoint
userRouter.post('/signup', userController.userSignUp)

userRouter.post('/signin', userController.userSignIn)

userRouter.get('/purchases', userMiddleware, userController.getUserPurchases)


module.exports = userRouter;