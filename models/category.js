const mongoose = require('mongoose')
//const { ObjectId } = mongoose.Schema

const categorySchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: 'This is for Category name',
        midlength: [3, "Too short"],
        maxlength: [32, "Too Long"],

    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true,

    },

},
    { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);