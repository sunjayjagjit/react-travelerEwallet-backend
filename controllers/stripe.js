const User = require("../models/user");
const Card = require("../models/cart");
const Package = require("../models/package");
const Reward = require("../models/reward");
const Cart = require("../models/cart");
const stripe = require("stripe")(process.env.STRIPE_SECRET)


exports.createPaymentIntent = async (req, res) => {

    // console.log(req.body);
    const { rewardApplied } = req.body
    // return;

    //apply rewards
    //total price after discount or not

    const user = await User.findOne({ email: req.user.email }).exec()

    const { cartTotal, totalDiscount } = await Cart.findOne({ orderedBy: user._id }).exec();

    console.log("Cart Packages total Charged", cartTotal, "After Discount%", totalDiscount);


    let finalPackagesAmount = 0;
    if (rewardApplied && totalDiscount) {
        finalPackagesAmount = Math.round(totalDiscount * 100);
    } else {
        finalPackagesAmount = Math.round(cartTotal * 100);
    }



    const paymentIntent = await stripe.paymentIntents.create({

        amount: finalPackagesAmount,
        currency: "myr",

    });
    res.send({
        //send information data to user
        clientSecret: paymentIntent.client_secret,
        cartTotal,
        totalDiscount,
        payable: finalPackagesAmount,
    });
};