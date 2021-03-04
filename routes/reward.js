const express = require('express');
const router = express.Router();

//import middlwares
//for auth  admin to login into the dashboard
const { authCheck, adminCheck } = require("../middlewares/auth");



//import from controller
const { create, remove, list } = require("../controllers/reward");

//routes
router.post("/reward", authCheck, adminCheck, create);
router.get("/rewards", list);
router.delete("/reward/:rewardId", authCheck, adminCheck, remove);




module.exports = router;