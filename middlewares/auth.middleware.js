const { getUser } = require("../services/Auth.js");
const { ApiResponse } = require("../utils/ApiResponse.js");

async function restrictToLoggedInUserOnly(req, res, next) {
    const userUid = req.cookies.uid;

    if(!userUid) return res.status(401).json(new ApiResponse(401, {}, "Un-Authorized"));
    
    const user = getUser(userUid);
    // console.log(user);

    if(!user) return res.status(401).json(new ApiResponse(401, {}, "Un-Authorized"));

    req.user = user;
    next();
}

module.exports = {
    restrictToLoggedInUserOnly
}