const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema;
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({

    packages: [
        {
            package: {
                type: ObjectId,
                ref: "Package",

            },

            count: Number,
            person: String,
        },
    ],

    paymentIntent: {},
    orderStatus: {
        type: String,
        default: "Not Successfully Order",
        enum: [
            "Not Successfully Order",
            "Successfully Order",
            "Dispatched",
            "Cancelled",
            "Completed",
        ]
    },
    orderedBy: {
        type: ObjectId,
        ref: "User"
    },
},
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);