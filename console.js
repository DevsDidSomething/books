var repl = require("repl");

var models = require('./models/index');

models.sequelize.sync().then(function() {
  var envName = process.env.NODE_ENV || "dev";

  // open the repl session
  var replServer = repl.start({
    prompt: "Bookshelf (" + envName + ") > ",
  });

  replServer.context.Book = models.Book;
});
