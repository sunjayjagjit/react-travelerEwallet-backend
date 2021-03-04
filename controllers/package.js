const Package = require("../models/package");
const User = require("../models/user");
const slugify = require("slugify");
const e = require("express");

exports.create = async (req, res) => {

    try {
        console.log(req.body);
        req.body.slug = slugify(req.body.title);
        const newPackage = await new Package(req.body).save()
        res.json(newPackage);

    } catch (err) {
        console.log(err);
        // res.status(400).send("Cannot create package");
        res.status(400).json({
            err: err.message,
        });
    }

};

exports.listAll = async (req, res) => {
    let packages = await Package.find({})
        //total items
        .limit(parseInt(req.params.count))
        .populate("category")
        .populate("subs")
        .sort([["createdAt", "desc"]])
        .exec();
    res.json(packages)
}

exports.remove = async (req, res) => {

    try {
        const deleted = await Package.findOneAndRemove({
            slug: req.params.slug,
        }).exec();
        res.json(deleted);

    } catch (err) {
        console.log(err);
        return res.status(400).send("Packages cannot be delete")
    }
};

exports.read = async (req, res) => {

    const packageupd = await Package.findOne({ slug: req.params.slug })
        .populate("category")
        .populate("subs")
        .exec();
    res.json(packageupd);
}

exports.update = async (req, res) => {

    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updatePackage = await Package.findOneAndUpdate(
            { slug: req.params.slug },
            req.body,
            { new: true }
        ).exec();
        res.json(updatePackage);
    } catch (err) {
        console.log("packages updates error", err);
        return res.status(400).send("Packages updates failed")
    }

};


// exports.list = async (req, res) => {
//     try {
//         const { sort, order, limit } = req.body
//         const packagesSell = await Package.find({})
//             .populate("category")
//             .populate("subs")
//             .sort([[sort, order]])
//             .limit(limit)
//             .exec();
//         res.json(packagesSell);
//     } catch (err) {
//         console.log(err);
//     }
// };

exports.list = async (req, res) => {
    try {
        const { sort, order, page } = req.body
        const currentPage = page || 1
        const nextPage = 3
        const packagesSell = await Package.find({})
            .skip((currentPage - 1) * nextPage)
            .populate("category")
            .populate("subs")
            .sort([[sort, order]])
            .limit(nextPage)
            .exec();
        res.json(packagesSell);
    } catch (err) {
        console.log(err);
    }
};

exports.packagesCount = async (req, res) => {

    let total = await Package.find({}).estimatedDocumentCount().exec();
    res.json(total);

};

exports.packageStar = async (req, res) => {

    const packagevaca = await Package.findById(req.params.packageId).exec();
    const user = await User.findOne({ email: req.user.email }).exec();
    const { star } = req.body

    let existingRatingObject = packagevaca.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
    );
    if (existingRatingObject === undefined) {
        let starAdded = await Package.findByIdAndUpdate(packagevaca._id, {
            $push: { ratings: { star, postedBy: user._id } },
        },
            { new: true }
        ).exec();
        console.log("starAdded", starAdded);
        res.json(starAdded);
    } else {

        const ratingUpdated = await Package.updateOne(
            {
                ratings: { $elemMatch: existingRatingObject },
            }, { $set: { "ratings.$.star": star } },
            { new: true }
        ).exec();
        console.log("ratingUpdated", ratingUpdated);
        res.json(ratingUpdated);
    }
};


exports.listRelatedPackage = async (req, res) => {

    const packagevaca = await Package.findById(req.params.packageId).exec();
    const related = await Package.find({
        _id: { $ne: packagevaca._id },
        category: packagevaca.category,
    })
        .limit(3)
        .populate("category")
        .populate("subs")
        .populate("postedBy", "_id name")
        .exec()
    res.json(related);
};

const handleQuery = async (req, res, searchQuery) => {
    const packages = await Package.find({ $text: { $search: searchQuery } })
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate("postedBy", "_id name")
        .exec()
    res.json(packages);
};

const handlePriceHome = async (req, res, price) => {
    try {
        let packages = await Package.find({
            price: {
                $gte: price[0], //first value price
                $lte: price[1], //second value
            },
        })
            .populate("category", "_id name")
            .populate("subs", "_id name")
            .populate("postedBy", "_id name")
            .exec()

        res.json(packages);
    } catch (err) {
        console.log(err);
    }
};

const handleCategory = async (req, res, category) => {
    try {
        let packages = await Package.find({ category })
            .populate("category", "_id name")
            .populate("subs", "_id name")
            .populate("postedBy", "_id name")
            .exec()
        res.json(packages)
    } catch (err) {
        console.log(err);
    }
}

const handleSub = async (req, res, sub) => {
    const packages = await Package.find({ subs: sub })
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate("postedBy", "_id name")
        .exec()

    res.json(packages);
}

const handlePerson = async (req, res, person) => {
    const packages = await Package.find({ person })
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate("postedBy", "_id name")
        .exec()
    res.json(packages);
}

const handlePackagetype = async (req, res, packagetype) => {
    const packages = await Package.find({ packagetype })
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate("postedBy", "_id name")
        .exec()
    res.json(packages);
}



exports.searchFiltersHome = async (req, res) => {

    const { searchQuery, price, category, sub, person, packagetype } = req.body

    if (searchQuery) {
        console.log("searchQuery", searchQuery)
        await handleQuery(req, res, searchQuery);
    }


    if (price !== undefined) {
        console.log("price checked", price);
        await handlePriceHome(req, res, price);
    }

    if (category) {
        console.log("category sucessfulyy", category);
        await handleCategory(req, res, category);

    }

    if (sub) {
        console.log("sub sucessfulyy", sub);
        await handleSub(req, res, sub);
    }

    if (person) {
        console.log("person sucessfulyy--->", person);
        await handlePerson(req, res, person)
    }

    if (packagetype) {
        console.log("packagetype sucessfulyy---> ", packagetype);
        await handlePackagetype(req, res, packagetype)
    }

};