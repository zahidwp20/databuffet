const Newsletter = require("../models/newsletter");

const fuzzy = (text) => new RegExp(text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "gi");
module.exports = {
  async index(req, res, next) {
    const { q, sort } = req.query;
    let query = {};
    if (q) {
      query = { email: fuzzy(q) };
    }
    const emails = await Newsletter.find(query)
      .sort(sort || "email")
      .lean();
    res.render("newsletter/index.ejs", { emails, q, sort });
  },

  async subscribe(req, res, next) {
    const { email } = req.body;
    await Newsletter.findOneAndUpdate({ email }, { email }, { upsert: true });
    req.session.success = "Subscription successful! Stay tuned for updates.";
    return res.redirect("back");
  },

  async remove(req, res, next) {
    const { id } = req.params;
    await Newsletter.deleteOne({ _id: id });
    req.session.success = "Unsubscribed successfully.";
    return res.redirect("back");
  },
};
