const Technology = require("../models/technology");
module.exports = {
  async create(req, res, next) {
    const { name } = req.body;
    await Technology.findOneAndUpdate({ name }, { name }, { upsert: true, collation: { locale: "en", strength: 2 } });
    req.session.success = "New technology added successful.";
    return res.redirect("back");
  },
};
