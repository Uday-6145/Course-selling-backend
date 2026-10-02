const PurchaseModel = require('../models/purchaseModel')
const UserModel = require('../models/userModel')
const CourseModel = require('../models/courseModel')
const zod = require('zod')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const userSignUp = async (req, res) => {
    const { email, password, firstname, lastname } = req.body


    //here we are checking that admin send the data in valid formate through zod
    const schema = zod.object({
        email: zod.string().email().min(5),
        password: zod.string().min(6),
        firstname: zod.string().min(3),
        lastname: zod.string().min(3)
    })

    const result = schema.safeParse(req.body)
    if (!result.success) {
        return res.json({
            message: "Incorrect data formate",
            error: result.error
        })
    }



    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        // first time user created
        await UserModel.create({
            email,
            password: hashedPassword,
            firstname,
            lastname
        })

        res.status(201).send("Signup successful!")
    }
    catch (err) {
        res.status(400).json("user already exists!")
    }
}


const userSignIn = async (req, res) => {
    const { email, password } = req.body;

    const schema = zod.object({
        email: zod.string().email(),
        password: zod.string().min(6)
    })

    const result = schema.safeParse(req.body)

    if (!result.success) {
        return res.json({
            message: "Incorrect data formate",
            error: result.error
        })
    }


    const user = await UserModel.findOne({
        email: email
    })

    if (!user) {
        res.status(403).json({
            message: "Invalid Credential!!"
        })
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (isPasswordMatch) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_USER_SECRET)
        res.status(200).json({ token: token })
    }
    else {
        res.status(403).json({ message: "Invalid Credentials!" });
    }



}


const getUserPurchases = async (req, res) => {
    //yeh userMiddleware se aaya
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized access"
        });
    }

    try {
        const purchases = await PurchaseModel.find({
            userId
        });

        if (!purchases || !purchases.length) {
            return res.status(200).json({
                courses: [],
                purchases: []
            });
        }

        // Must use courseId (not id) to match CourseModel _id
        const purchasesCourseId = purchases.map((eachPurchase) => eachPurchase.courseId);
        const courseData = await CourseModel.find({
            _id: { $in: purchasesCourseId }
        });

        return res.status(200).json({
            courses: courseData,
            purchases
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error fetching purchases",
            error: err.message
        });
    }
}




module.exports = {
    userSignIn, userSignUp, getUserPurchases
}