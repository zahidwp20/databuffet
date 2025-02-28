module.exports = {
  async index(req, res, next) {
    res.render("HomePage");
  },
  async about(req, res, next) {
    res.render("AboutPage");
  },
  async contact(req, res, next) {
    res.render("ContactPage");
  },
  async careerCenter(req, res, next) {
    res.render("CareerCenterPage");
  },
  async privacy(req, res, next) {
    res.render("PrivacyPage");
  },
  async terms(req, res, next) {
    res.render("TermsPage");
  },
};
