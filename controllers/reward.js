const { json } = require("body-parser");
const Reward = require("../models/reward")


// 3 method to use


exports.create = async (req, res) => {
    try {
        const { name, expirydate, discount } = req.body.reward;
        res.json(await new Reward({ name, expirydate, discount }).save());
    } catch (err) {
        console.log(err);
    }

}


exports.remove = async (req, res) => {

    try {
        res.json(await Reward.findByIdAndDelete(req.params.rewardId).exec());
    } catch (err) {
        console.log(err);
    }

}



exports.list = async (req, res) => {

    try {
        res.json(await Reward.find({}).sort({ createdAt: -1 }).exec());
    } catch (err) {
        console.log(err);
    }

};