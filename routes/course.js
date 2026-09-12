const {Router} = require('express')

const courseRouter = Router();


courseRouter.post('/purchase', (req, res)=> {

})

courseRouter.get('/preview', (req, res)=> {
    res.send('courses endpoint')
})


module.exports =  courseRouter

