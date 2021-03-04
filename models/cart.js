const mongooese = require("mongoose")
const { ObjectId } = mongooese.Schema

const cartSchema = new mongooese.Schema({

    packages: [
        {
            package: {
                type: ObjectId,
                ref: "Package",

            },

            count: Number,
            person: String,
            price: Number,
        },
    ],
    cartTotal: Number,
    totalDiscount: Number,
    orderedBy: {
        type: ObjectId,
        ref: "User"
    },
}, {
    timestamps: true
}
);

module.exports = mongooese.model("Cart", cartSchema);

