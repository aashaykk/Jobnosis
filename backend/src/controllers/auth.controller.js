const userModel = require("../models/user.model.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model.js")


async function registerUser(req, res) {
    
    const { username, email, password } = req.body

    if(!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide username, email and password"
        })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Please provide a valid email address (e.g. name@domain.com)"
        })
    }

    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long"
        })
    }

    if (!/[A-Z]/.test(password)) {
        return res.status(400).json({
            message: "Password must contain at least one uppercase letter"
        })
    }

    if (!/[a-z]/.test(password)) {
        return res.status(400).json({
            message: "Password must contain at least one lowercase letter"
        })
    }

    if (!/\d/.test(password)) {
        return res.status(400).json({
            message: "Password must contain at least one number"
        })
    }

    if (!/[@$!%*?&#]/.test(password)) {
        return res.status(400).json({
            message: "Password must contain at least one special character (e.g., @$!%*?&#)"
        })
    }

    const userAlreadtExists = await userModel.findOne({
        $or: [ {username}, {email} ]
    })

    if(userAlreadtExists) {
        return res.status(400).json({
            message: "Acc already exists"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    
    )

    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

async function logInUser(req, res) {

    const { email, password } = req.body

    const user = await userModel.findOne({
        email
    })

    if(!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    
    )

    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

async function logoutUser(req, res) {
    const token = req.cookies.token

    if(token) {
        await tokenBlacklistModel.create({token})
    }

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully",
    })    
}

async function getUser(req, res) {
    const user = await userModel.findById(req.user.id)

    return res.status(200).json({

        message: "User details fethced successfully",

        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

module.exports = {
    registerUser,
    logInUser,
    logoutUser,
    getUser
}