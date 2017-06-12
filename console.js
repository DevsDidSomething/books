var repl = require("repl");

var models = require('./models/index');

models.sequelize.sync().then(function() {
  var envName = process.env.NODE_ENV || "dev";

  // open the repl session
  var replServer = repl.start({
    prompt: "Bookshelf (" + envName + ") > ",
  });

  replServer.context.User = models.User;
  replServer.context.Book = models.Book;
  replServer.context.Mix = models.Mix;
});
