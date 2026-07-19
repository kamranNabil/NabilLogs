import Post from "../models/Postsmodels.js";

const increasedVisit = async (req, res, next) => {
    const slug = req.params.slug;

    await Post.findOneAndUpdate({ slug }, { $inc: { visits: 1 } });

    next();
};

export default increasedVisit;