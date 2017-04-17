function load(path, operation) {


  var jsdom = require("jsdom");
  var fs = require("fs");


  fs.readFile(`./public/index.html`, 'utf8', function(error, data) {
    jsdom.env(data, [], function (errors, window) {
      var $ = require('jquery')(window);
      const number_elements = $(".tableOfContents > li").length;

      if (operation === "add"){
        $("h3").html(`These are ${number_elements + 1}`);

        const newlink = $("<a />", {
        text: path,
        href:`/${path.toLowerCase()}.html`
        });

        $("ol").append($(`\n<li id = ${path}>\n\n`).append(newlink));
      }

      else if (operation === "remove"){
        $("h3").html(`These are ${number_elements - 1}`);
        $(`#${path}`).remove();
      }

      fs.writeFile(`./public/index.html`, window.document.documentElement.outerHTML,
                   function (error){
          if (error) throw error;
      });
    });
  });
}

module.exports = load;

