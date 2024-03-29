const Category = require('../models/category');
const Package = require("../models/package")
const Sub = require("../models/sub")
const slugify = require("slugify")


exports.create = async (req, res) => {

    try {
        const { name } = req.body
        // category = await new Category({name, slug:slugify(name) }).save();
        res.json(await new Category({ name, slug: slugify(name) }).save());
    } catch (err) {
        console.log(err);
        res.status(400).send("Cannot create category");
    }
};

exports.list = async (req, res) => {
    res.json(await Category.find({}).sort({ createdAt: -1 }).exec());

};

exports.read = async (req, res) => {
    const category = await Category.findOne({ slug: req.params.slug }).exec();
    // res.json(category);
    const packages = await Package.find({ category: category })
        .populate("category")
        // .populate("postedBy", "_id name")
        .exec()
    res.json({
        category,
        packages,
    });

};

exports.update = async (req, res) => {

    const { name } = req.body;
    try {
        const updated = await Category.findOneAndUpdate(
            { slug: req.params.slug },
            { name, slug: slugify(name) },
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(400).send("Update Category failded")
    }
};

exports.remove = async (req, res) => {
    try {
        const deleted = await Category.findOneAndDelete({ slug: req.params.slug });
        res.json(deleted);
    } catch (err) {
        res.status(400).send("Delete Category Failed")
    }

};

exports.getSubs = (req, res) => {
    Sub.find({ parent: req.params._id }).exec((err, subs) => {
        if (err) console.log(err);
        res.json(subs);
    });
};