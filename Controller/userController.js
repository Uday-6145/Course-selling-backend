const PurchaseModel = require('../models/purchaseModel')
const {UserModel} = require('../models/userModel.js')



const userSignUp = async(req, res) => {
    const {email, password, firstname, lastname} = req.body


    //here we are checking that admin send the data in valid formate through zod
    const schema = zod.object({
        email: zod.email().string().min(5),
        password: zod.string().min(6),
        firstname:zod.string().min(3),
        lastname: zod.string().min(3)
    })

    const result = schema.safeParse(req.body)
    if(!result.success){
        res.json({
            message: "Incorrect data formate",
            error: result.error
        })
    }



    const hashedPassword = bcrypt.hash(password, 10)

    try{
        // first time user created
        await UserModel.create({
            email,
            password: hashedPassword,
            firstname,
            lastname
        })

        res.status(201).send("Signup successful!")
    }
    catch(err){
        res.status(400).json("user already exists!")
    }
}


const userSignIn = async(req, res) => {
    const {email, password} = req.body;

    const schema = zod.object({
        email: zod.email().string(),
        password: zod.string().min(6)
    })

    const result = schema.safeParse(req.body)

    if(!result.success){
        res.json({
            message: "Incorrect data formate",
            error: result.error
        })
    }

    const user = await UserModel.findOne({
        email: email
    })

    if(!user){
        res.status(403).json({
            message: "Invalid Credential!!"
        })
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if(isPasswordMatch){
        const token = jwt.sign({id: user._id}, process.env.JWT_USER_SECRET)
        res.status(200).json({token: token})
    }
    else{
        res.status(403).json({ message: "Invalid Credentials!" });
    }



}


const getUserPurchases = async(req, res) => {
    const userId = req.body

    if(!userId){
        res.status(401).json({
            message: "Unauthorized access"
        })
    }

    const purchases = await PurchaseModel.find({
        userId
    })

    if(!purchases.length){
        res.status(404).json({
            message: "No purchases found",
        })
    }

    
}   