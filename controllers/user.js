const User = require("../models/user");
const Package = require("../models/package");
const Cart = require("../models/cart");
const Reward = require("../models/reward");
const Order = require("../models/order");


exports.userCart = async (req, res) => {

    console.log(req.body);
    const { cart } = req.body;

    let packages = []

    const user = await User.findOne({ email: req.user.email }).exec();

    let cartExistUser = await Cart.findOne({ orderedBy: user._id }).exec();

    if (cartExistUser) {
        cartExistUser.remove()
        console.log("removed old cart");
    }

    for (let i = 0; i < cart.length; i++) {
        // packagevac
        let object = {}
        object.package = cart[i]._id;
        object.count = cart[i].count
        object.person = cart[i].person

        let { price } = await Package.findById(cart[i]._id).select("price").exec();
        object.price = price

        packages.push(object);

    }

    console.log("packages", packages);

    let cartTotal = 0;
    for (let i = 0; i < packages.length; i++) {
        cartTotal = cartTotal + packages[i].price * packages[i].count;
    }

    console.log("cartTotal", cartTotal);

    let newCart = await new Cart({
        packages,
        cartTotal,
        orderedBy: user._id,
    }).save();

    console.log("new updated cart", newCart);
    res.json({ ok: true });
};

exports.getUserDetailsCart = async (req, res) => {

    const user = await User.findOne({ email: req.user.email }).exec()

    const cart = await Cart.findOne({ orderedBy: user._id })
        .populate("packages.package", "_id title price totalDiscount")
        .exec();

    const { packages, cartTotal, totalDiscount } = cart;
    res.json({
        packages,
        cartTotal,
        totalDiscount
    })
};

exports.removeUserCart = async (req, res) => {

    const user = await User.findOne({ email: req.user.email }).exec();
    const cart = await Cart.findOneAndRemove({ orderedBy: user._id });
    res.json(cart);

};

exports.saveDetails = async (req, res) => {

    const saveUserAddress = await User.findOneAndUpdate(

        { email: req.user.email },
        { address: req.body.address }

    ).exec();
    res.json({ ok: true })
}

exports.applyRewardCart = async (req, res) => {

    const { reward } = req.body
    console.log("Rewards", reward);

    //Only valid reward accepetedable

    const validReward = await Reward.findOne({ name: reward }).exec()
    if (validReward === null) {
        return res.json({
            err: "Invalid Reward"
        });
    }
    console.log("Valid Reward", validReward);
    //login to redeem the rewards
    const user = await User.findOne({ email: req.user.email }).exec();

    let { packages, cartTotal } = await Cart.findOne({ orderedBy: user._id })
        .populate("packages.package", "_id title price")
        .exec();
    console.log("cartTotal", cartTotal, "discount%", validReward.discount);

    //total price after redeem rewards

    let totalDiscount = (
        cartTotal = (cartTotal * validReward.discount) / 100)
        .toFixed(2);

    Cart.findOneAndUpdate(
        { orderedBy: user._id },
        { totalDiscount },
        { new: true }
    ).exec();

    res.json(totalDiscount);
};


exports.saveOrder = async (req, res) => {

    const { paymentIntent } = req.body.stripeReponse;
    const user = await User.findOne({ email: req.user.email }).exec();

    let { packages } = await Cart.findOne({ orderedBy: user._id }).exec();

    let newOrder = await new Order({

        packages,
        paymentIntent,
        orderedBy: user._id,

    }).save();

    // decrement quantity of the packages and increment sold
    let bulkOption = packages.map((item) => {

        return {
            updateOne: {
                filter: { _id: item.package._id }, //import from item.package
                update: { $inc: { quantity: -item.count, sold: +item.count } },
            },
        };

    });

    let updated = await Package.bulkWrite(bulkOption, {});
    console.log("updated Packages on quantity and Sold", updated);


    console.log("New Order Packages Successfully saved", newOrder);
    res.json({ ok: true });
}

exports.userOrdersDetails = async (req, res) => {

    let user = await User.findOne({ email: req.user.email }).exec();

    let userOrders = await Order.find({ orderedBy: user._id })
        .populate("packages.package")
        .exec();

    res.json(userOrders)


}