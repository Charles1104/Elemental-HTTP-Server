function load(path) {

  var jsdom = require("jsdom");
  var fs = require("fs");

  fs.readFile(`./public/index.html`, 'utf8', function(error, data) {
      jsdom.env(data, [], function (errors, window) {
          var $ = require('jquery')(window);

          var newlink = $("<a />", {
          text: path,
          title: path,
          href:`/${path}.html`
          });

          $("ol").append($('\n<li>\n\n').append(newlink));

            // ($('<a>\n\n').attr('href',`/${path}.html`)));

          fs.writeFile(`./public/index.html`, window.document.documentElement.outerHTML,
                       function (error){
              if (error) throw error;
          });
      });
  });
}

module.exports = load;

