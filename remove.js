function remove(path) {

  var jsdom = require("jsdom");
  var fs = require("fs");

  fs.readFile(`./public/index.html`, 'utf8', function(error, data) {
    jsdom.env(data, [], function (errors, window) {
      var $ = require('jquery')(window);

      const number_elements = $(".tableOfContents > li").length;

      $("h3").html(`These are ${number_elements - 1}`);

      $(`#${path}`).remove();

      fs.writeFile(`./public/index.html`, window.document.documentElement.outerHTML,
                   function (error){
          if (error) throw error;
      });
    });
  });
}

module.exports = remove;