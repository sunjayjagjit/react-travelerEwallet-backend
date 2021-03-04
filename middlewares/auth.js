const admin = require("../firebase");
const User = require("../models/user");

exports.authCheck = async (req, res, callback) => {

    //get the token from the users
    //console.log(req.headers);
    try {
        const firebaseUser = await admin
            .auth()
            .verifyIdToken(req.headers.authtoken);
        //console.log("Firebase user in AuthCheck", firebaseUser);
        req.user = firebaseUser;
        callback();
    } catch (err) {
        console.log(err);
        res.status(401).json({
            err: "Invalid or expired token",
        });
    }
};

exports.adminCheck = async (req, res, next) => {

    const { email } = req.user

    const adminUser = await User.findOne({ email }).exec()
    if (adminUser.role !== 'admin') {
        res.status(403).json({
            err: "Only Admin, Access denied",
        })
    } else {
        next();
    }
};



