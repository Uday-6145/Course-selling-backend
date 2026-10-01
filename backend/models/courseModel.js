const mongoose = require('mongoose')
const ObjectId = mongoose.ObjectId
const Schema = mongoose.Schema

const CourseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: ObjectId
})

const CourseModel = mongoose.model('course', CourseSchema)


module.exports = CourseModel