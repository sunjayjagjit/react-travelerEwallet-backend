const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const packageSchema = new mongoose.Schema({

    title: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        text: true,
    },

    slug: {
        type: String,
        unique: true,
        maxlength: 32,
        lowercase: true,
        index: true,
    },

    description: {
        type: String,
        required: true,
        maxlength: 1000,
        text: true,
    },

    price: {
        type: Number,
        required: true,
        trim: true,
        maxlength: 32,
    },

    category: {

        type: ObjectId,
        ref: "Category",
    },

    subs: [
        {
            type: ObjectId,
            ref: "Sub",

        },
    ],

    quantity: Number,
    sold: {
        type: Number,
        default: 0,
    },

    images: {
        type: Array
    },

    person: {
        type: String,
        enum: ["2person", "4person", "6person", "10person"],
    },

    packagetype: {
        type: String,
        enum: ["Couple", "FamilyAdventure", "BackPackers", "IslandParadise"],
    },

    ratings: [
        {
            star: Number,
            postedBy: { type: ObjectId, ref: "User" },
        },
    ],
},
    { timestamps: true }

);

module.exports = mongoose.model("Package", packageSchema);