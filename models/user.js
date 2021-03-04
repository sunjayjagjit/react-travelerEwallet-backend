const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({

    name: String,
    email: {
        type: String,
        required: true,
        index: true,
    },
    role: {
        type: String,
        default: "subscriber",
    },
    cart: {
        type: Array,
        default: [],
    },
    contact: {
        type: Number,
        validate: {
            validator: function (v) {
                return /d{10}/.test(v);
            },
            message: '{VALUE} is not a valid 10 digit number!'
        }
    },

    address: String,
    //wishlist:[{ type: ObjectId, ref: "Product"}],

},
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);