const User = require("../models/user.model.js");
const { setUser, deleteUserSession } = require("../services/Auth.js");
const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { v4: uuidv4 } = require("uuid")

async function signUp(req, res) {

    const { name, email, password } = req.body;

    // return res.json({name, email, password});

    if ( ![name, email, password].every(Boolean) ) {
        return res.status(400).json(
            new ApiResponse(400, [], 'Required fields are missing.')
        )
    }

    if ( [name, email, password].some((field) => field?.trim() === "") ) {
        return res.status(200).json(
            new ApiResponse(200, {}, 'All fields are required.')
        )
    }

    const user = await User.create({
        name: name,
        email: email,
        password: password
    })

    const createdUser = await User.findById(user._id).select("-password");

    if(!createdUser) {
        throw new ApiError(500, "something went wrong while registering the user.")
    }
    
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successully.")
    )
}

async function login(req, res) {
    const { email, password } = req.body;

    if( ![email, password].every(Boolean) ) {
        return res.status(200).json(
            new ApiResponse(200, {}, "Both, Email & Password required.")
        )
    }

    const user = await User.findOne({
        $and: [
            {
                email
            },
            {
                password
            }
        ]
    }).select("-_id -password")

    if(!user) {
        return res.status(200).json(
            new ApiResponse(200, {}, "Credentials Not Matched.")
        )
    }

    const sessionId = uuidv4();
    setUser(sessionId, user);
    res.cookie("uid", sessionId);
    // console.log(sessionId);

    return res.status(200).json(
        new ApiResponse(200, user, "User Logged In.")
    )
}

async function logout(req, res) {
    const cookieId = req.cookies.uid;

    if(!cookieId) return res.status(401).json(new ApiResponse(401, {}, "Un-Authorized"));

    const deleted = deleteUserSession(cookieId);

    if(!deleted) {
        return res.status(404).json(new ApiResponse(404, {}, "Session Not Found!"))
    }

    res.clearCookie("uid");
    return res.status(200).json(
        new ApiResponse(200, {}, "User Logged Out")
    )
}

module.exports = {
    signUp,
    login,
    logout
}