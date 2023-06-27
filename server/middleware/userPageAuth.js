const jwt = require("jsonwebtoken")
const User = require("../models/users")

const userPageAuth = async (req, res, next) => {
    try {
        const token = req.cookies.electricianCookiesUser // voter_evotingLoginToken ki jagah aapne token ka naam likhe
        const verifyToken = jwt.verify(token, process.env.SECRET_CHAR)

        const rootUser = await User.findOne({ _id : verifyToken._id, "tokens.token" : token })

        if(!rootUser) { throw new Error("User Data cannot find")}
        req.token = token;
        req.rootUser = rootUser;
        req.AdminId = rootUser._id
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send("Unauthorized: No token Found")
    }
}

module.exports = userPageAuth