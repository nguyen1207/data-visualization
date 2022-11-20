const helloController = {
  hello: (req, res) => {
    res.render("hello.handlebars");
  },
};

module.exports = helloController;
