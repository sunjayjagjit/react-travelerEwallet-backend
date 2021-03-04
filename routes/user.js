const express = require('express');

const router = express.Router();

const { authCheck } = require("../middlewares/auth");
const { userCart, getUserDetailsCart, removeUserCart, saveDetails, applyRewardCart, saveOrder, userOrdersDetails } = require("../controllers/user");

router.post("/user/cart", authCheck, userCart);
router.get("/user/cart", authCheck, getUserDetailsCart);
router.put("/user/cart", authCheck, removeUserCart);
router.post("/user/details", authCheck, saveDetails);

router.post("/user/order", authCheck, saveOrder);
router.get("/user/orders", authCheck, userOrdersDetails);




router.post("/user/cart/reward", authCheck, applyRewardCart)
// router.get("/user", (req, res) => {

//     res.json({
//         data: "you just enter the user for the API endpoint",
//     });

// });

module.exports = router;