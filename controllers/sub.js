const Sub = require('../models/sub');
const Package = require("../models/package");
const slugify = require("slugify")


exports.create = async (req, res) => {

    try {
        const { name, parent } = req.body
        res.json(await new Sub({ name, parent, slug: slugify(name) }).save());
    } catch (err) {
        console.log(err);
        res.status(400).send("Cannot create subcategory failed");
    }
};

exports.list = async (req, res) => {
    res.json(await Sub.find({}).sort({ createdAt: -1 }).exec());

};

exports.read = async (req, res) => {
    const sub = await Sub.findOne({ slug: req.params.slug }).exec();
    const packages = await Package.find({ subs: sub })
        .populate("category")
        .exec();
    res.json({
        sub,
        packages,
    });
};

exports.update = async (req, res) => {

    const { name, parent } = req.body;
    try {
        const updated = await Sub.findOneAndUpdate(
            { slug: req.params.slug },
            { name, parent, slug: slugify(name) },
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(400).send("Update SubCategory failded")
    }
};

exports.remove = async (req, res) => {
    try {
        const deleted = await Sub.findOneAndDelete({ slug: req.params.slug });
        res.json(deleted);
    } catch (err) {
        res.status(400).send("Delete SubCategory Failed")
    }

};