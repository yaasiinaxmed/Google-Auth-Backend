import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import userModel from "../models/user.model.js"

const sercretKey = 'secret'

// Register with Google Auth
export const GoogleAuth = async (req, res) => {
    const {avatar, name, email} = req.body
    try {
        // check if the user existing already exists in database
        const user = await userModel.findOne({email})

        if(user) {
            const token = jwt.sign({id: user._id}, sercretKey, {expiresIn: "7d"})

            res.status(200).json({status: 200, messages: "Sign In Was successfully", token})
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)

            const hashedPassword = await bcrypt.hash(generatedPassword, 10)

            const newUser = new userModel({
                avatar,
                name,
                email,
                password: hashedPassword
            })

            await newUser.save()

            const token = jwt.sign({id: newUser._id}, sercretKey, {expiresIn: "7d"})

            res.status(200).json({status: 200, messages: "Sign Up Was successfully", token})
        }
    } catch (error) {
        res.status(500).json({status: 500, message: "Internal Server Error", errorMessage: error})
    }
}