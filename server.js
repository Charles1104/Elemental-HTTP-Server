/*jshint esversion: 6 */

const http = require("http");
const fs = require("fs");
const querystring = require('querystring');
const buildHtml = require("./HTML_builder.js");
const load = require("./loadIndex.js");

const server = http.createServer((req,res) => {

//HELPER FUNCTION
  var read = (file,utf8) => {
    return fs.readFile(file,utf8,function(err, data){
      res.end(data);
    });
  };

// GET
  if (req.method === "GET"){
    if(req.url === "/"){
      read(`./public/index.html`, 'utf8');
    }

    else{
      fs.readFile(`./public${req.url}`, 'utf8',function(err, data){
        if(err){
          read("./public/404.html", 'utf8');
        }
        else {
        res.end(data);
        }
      });
    }
  }

// POST
  if (req.method === "POST"){

    req.on("data", (data)=> {
      const parsed_post = querystring.parse(data.toString());
      const keys = Object.keys(parsed_post);

      const name = parsed_post.name;
      const symbol = parsed_post.symbol;
      const number = parsed_post.number;
      const description = parsed_post.description;

        if (keys[0] === "name"){
          var filename = `./public/${name}.html`;
          var stream = fs.createWriteStream(filename);
          stream.on("open", function(){
            var html = buildHtml(name, symbol, number, description);
            stream.end(html);
          });
          load(`${name}`);
        }
    });
  }

// PUT
 if (req.method === "PUT"){

 }

});

server.listen(3000, () => {
  console.log("Server started on port 3000");
});
