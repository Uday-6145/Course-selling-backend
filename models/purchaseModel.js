const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId
const Schema = mongoose.Schema

const PurchaseSchema = new Schema({
    userId: ObjectId,
    courseId: ObjectId 
})

const PurchaseModel = mongoose.model('purchase', PurchaseSchema)

module.exports = PurchaseModel