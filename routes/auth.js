const express = require('express');

const router = express.Router();

//import middlwares
const { authCheck, adminCheck } = require("../middlewares/auth");



//import from controller
const { createOrUpdatesUsers, currentUser } = require("../controllers/auth");

// const myMiddleware = (req, res, callback) => {
//     console.log(" im middle ware");
//     callback();

// };

router.post("/create-or-update-user", authCheck, createOrUpdatesUsers);
router.post("/current-liveuser", authCheck, currentUser);
router.post("/current-liveadmin", authCheck, adminCheck, currentUser);



module.exports = router;