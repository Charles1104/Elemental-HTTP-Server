function edit(file, name, symbol, number, description) {

  var jsdom = require("jsdom");
  var fs = require("fs");

  fs.readFile(file, 'utf8', function(error, data) {
    jsdom.env(data, [], function (errors, window) {
      var $ = require('jquery')(window);

      $("h1").text(name);
      $("h2").text(symbol);
      $("h3").text(number);
      $("p:first").text(description);

      fs.writeFile(file, window.document.documentElement.outerHTML,
                   function (error){
          if (error) throw error;
      });
    });
  });
}

module.exports = edit;