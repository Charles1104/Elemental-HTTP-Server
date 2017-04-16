function remove() {

  var jsdom = require("jsdom");
  var fs = require("fs");

  fs.readFile(`./public/index.html`, 'utf8', function(error, data) {
    jsdom.env(data, [], function (errors, window) {
      var $ = require('jquery')(window);

      // const test = $("#Hydrogen").text();

      $("#Hydrogen").remove();


      fs.writeFile(`./public/index.html`, window.document.documentElement.outerHTML,
                   function (error){
          if (error) throw error;
      });
    });
  });
}

remove();

// module.exports = remove;