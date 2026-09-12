const {Router} = require('express')

const userRouter = Router();


    userRouter.post('/signup', (req, res)=> {
        res.json("SignUp endpoint")
    })
    
    userRouter.post('/signin', (req, res)=> {
        res.send("SignIn endpoint")
    })

    userRouter.post('/purchases', (req, res)=> {
        res.send("user purchase endpoint")
    })


module.exports = userRouter;