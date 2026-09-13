const {Router} = require('express')
const {UserModel} = require('../db.js')
const userRouter = Router();
const jwt = require('jsonwebtoken') 


    userRouter.post('/signup', async(req, res)=> {
        const {email, password, firstName, lastName} = req.body //TODO: adding zod validation
        //TODO: hash the password so plain text password not stored in db.

        //TODO: Put inside a try catch block
        await UserModel.create({
            email: email,
            password : password,
            firstName: firstName,
            lastName: lastName
        })

        res.json("SignUp Succedded")
    })
    
    userRouter.post('/signin', async(req, res)=> {

        const {email, password} = req.body
        //TODO: ideally password should be hashed hence you cant compare user provided provided
        const user = await UserModel.findOne({
            email: email,
            password: password
        })

        if(user){
            const token = jwt.sign({
                id: user._id
            }, process.env.JWT_USER_SECRET)

            res.json({
                token: token
            })
        }
        else{
            res.status(403).json({
                message: "Incorrect credential!!!"
            })
        }

    })

    userRouter.post('/purchases', (req, res)=> {
        res.send("user purchase endpoint")
    })


module.exports = userRouter;