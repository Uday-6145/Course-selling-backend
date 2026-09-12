const express = require('express')
const userRouter = require('./routes/user');
const courseRouter = require('./routes/course');
const adminRouter = require('./routes/admin')

const mongoose = require('mongoose')
//create an instance
const app = express()

app.use('/user', userRouter);
app.use('/course', courseRouter)
app.use('/admin', adminRouter)


const main = async() => {
    await mongoose.connect('mongodb+srv://udaypratap6145_db_user:lKyiAGB82DpnTdWZ@cluster0.9h1n5nr.mongodb.net/coursera-app')
    app.listen(3000)
    console.log("Listening on port 3000")
}
main();

