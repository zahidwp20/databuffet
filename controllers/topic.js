const Topic = require("../models/topic");
module.exports = {
  async create(req, res, next) {
    const { name } = req.body;
    await Topic.findOneAndUpdate({ name }, { name }, { upsert: true, collation: { locale: "en", strength: 2 } });
    req.session.success = "New topic added successful.";
    return res.redirect("back");
  },
};
