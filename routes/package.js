const express = require('express');
const router = express.Router();

//import middlwares
//for auth  admin to login into the dashboard
const { authCheck, adminCheck } = require("../middlewares/auth");



//import from controller
const { create, listAll, list, remove, read, update, packagesCount, packageStar, listRelatedPackage, searchFiltersHome } = require("../controllers/package");

//routes
router.post("/package", authCheck, adminCheck, create);
router.get("/packages/total", packagesCount)
router.get("/packages/:count", listAll);
router.delete("/package/:slug", authCheck, adminCheck, remove);
router.get("/package/:slug", read);
router.put("/package/:slug", authCheck, adminCheck, update);
router.post("/packages", list);
router.put("/package/star/:packageId", authCheck, packageStar);
router.get("/package/related/:packageId", listRelatedPackage);
router.post("/search/filters", searchFiltersHome);







module.exports = router;