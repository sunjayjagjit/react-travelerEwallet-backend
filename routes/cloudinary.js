const express = require('express');
const router = express.Router();

//only admin can access
const { authCheck, adminCheck } = require("../middlewares/auth");

const { upload, remove } = require("../controllers/cloudinary");

//upload mulitple images
router.post("/uploadimages", authCheck, adminCheck, upload);

//remove one image
router.post("/removeimage", authCheck, adminCheck, remove);

module.exports = router;