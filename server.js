/*jshint esversion: 6 */

const http = require("http");
const fs = require("fs");
const querystring = require('querystring');
const buildHtml = require("./HTML_builder.js");
const updateIndex = require("./updateIndex.js");
const edit = require("./editFile.js");

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

  req.on("data", (data)=> {

    const parsed = querystring.parse(data.toString());
    const keys = Object.keys(parsed);

    const name = parsed.name;
    const symbol = parsed.symbol;
    const number = parsed.number;
    const description = parsed.description;

// POST
    if (req.method === "POST"){

      if (keys[0] === "name"){
        var filename = `./public/${name.toLowerCase()}.html`;
        var stream = fs.createWriteStream(filename);
        stream.on("open", function(){
          var html = buildHtml(name, symbol, number, description);
          stream.end(html);
        });
        updateIndex(name,"add");
        res.writeHead(200,{"success": "true"},{"Content-Type": "application/json"});
        res.end();
      }
    }

  // PUT
    if (req.method === "PUT"){
      fs.readFile(`./public${req.url}`, 'utf8',function(err, data){
        if(err){
          res.writeHead(500,{"error": `resource ${req.url} does not exist`},{"Content-Type": "application/json"});
          res.end();
        }
        else {
          edit(`./public${req.url}`,name, symbol, number, description);
          res.writeHead(200,{"success": "true"},{"Content-Type": "application/json"});
          res.end();
        }
      });
    }

  // DELETE
    if (req.method === "DELETE"){
      fs.unlink(`./public${req.url}`, function(err){
        if(err){
          res.writeHead(500,{"error": `resource ${req.url} does not exist`},{"Content-Type": "application/json"});
          res.end();
        } else{
          updateIndex(name,"remove");
          res.writeHead(200,{"success": "true"},{"Content-Type": "application/json"});
          res.end();
        }
      });
    }

  });
});

server.listen(3000, () => {
  console.log("Server started on port 3000");
});
