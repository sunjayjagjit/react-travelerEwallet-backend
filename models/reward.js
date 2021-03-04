const mongooese = require("mongoose")
const { ObjectId } = mongooese.Schema

const rewardSchema = new mongooese.Schema({


    name: {
        type: String,
        trim: true,
        unique: true,
        uppercase: true,
        required: "Rewards of Name required",
        minlength: [6, "Too Short"],
        maxlength: [12, "Too Long"],
    },

    expirydate: {
        type: Date,
        required: true,
    },

    discount: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true
}
);

module.exports = mongooese.model("Reward", rewardSchema);