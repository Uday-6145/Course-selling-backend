const mongoose = require('mongoose')




const schema = mongoose.Schema
const ObjectId = mongoose.ObjectId



const UserSchema = new schema({
    email: {type: String, unique: true},
    password: String,
    firstName: String,
    lastName: String
})

const CourseSchema = new schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: ObjectId
})


const AdminSchema = new schema({
    userId: ObjectId,
    email: {type: String, unique: true},
    password: String,
    firstName: String,
    lastName: String
})

const PurchaseSchema = new schema({
    userId: ObjectId,
    courseId: ObjectId 
})

const UserModel = mongoose.model('user', UserSchema)
const CourseModel = mongoose.model('course', CourseSchema)
const AdminModel = mongoose.model('admin', AdminSchema)
const PurchaseModel = mongoose.model('purchase', PurchaseSchema)


module.exports = {
    UserModel,
    CourseModel,
    AdminModel,
    PurchaseModel
}