const express = require('express')
const userRouter = require('./routes/user');
const courseRouter = require('./routes/course');
const adminRouter = require('./routes/admin')
const cors = require('cors')
require('dotenv').config()

const mongoose = require('mongoose')
//create an instance
const app = express()
app.use(express.json())
app.use(cors())

app.use('/user', userRouter);
app.use('/course', courseRouter)
app.use('/admin', adminRouter)


const PORT = process.env.PORT || 3000;

const main = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
    }
}
main();

module.exports = app;

