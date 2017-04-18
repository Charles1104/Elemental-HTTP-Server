/*jshint esversion: 6 */

const http = require("http");
const fs = require("fs");
const querystring = require('querystring');
const buildHtml = require("./HTML_builder.js");
const updateIndex = require("./updateIndex.js");
const edit = require("./editFile.js");
const auth = require("./auth.js");

const server = http.createServer((req,res) => {

//HELPER FUNCTION
  var read = (file, req) => {
    var format = req.url.slice(req.url.lastIndexOf(".") + 1);
    if (format !== "html" && format !== "css"){
      format = "html";
    }
    return fs.readFile(file,'utf8',function(err, data){
      if(err){
        fs.readFile("./public/404.html",'utf8',function(err, data){
          if(err){
            res.writeHead(503,{"Content-Type": "application/json"});
            res.end(JSON.stringify({"error": "server issue"}));
          }
        });
      }
      else {
        res.writeHead(200,{"Content-Type": `text/${format}`});
        res.end(data);
      }
    });
  };

// GET
  if (auth(req,res) === true){
    if (req.method === "GET"){
      if(req.url === "/"){
        read(`./public/index.html`, req);
      }
      else{
        read(`./public${req.url}`, req);
      }
    }
  }

  req.on("data", (data)=> {

    const parsed = querystring.parse(data.toString());
    const keys = Object.keys(parsed);

    const name = parsed.name;
    const symbol = parsed.symbol;
    const number = parsed.number;
    const description = parsed.description;

    // Ask for authetification before apply either the POST, PUT or DELETE
    if (auth(req,res) === true){

      // POST
      if (req.method === "POST"){
        if (keys[0] === "name"){
          var filename = `./public/${name.toLowerCase()}.html`;
          fs.stat(filename, function(err, stats){
            if (!stats){
              var stream = fs.createWriteStream(filename);
              stream.on("open", function(){
                var html = buildHtml(name, symbol, number, description);
                stream.end(html);
              });
              updateIndex(name,"add");
              res.writeHead(200,{"Content-Type": "application/json"});
              res.end(JSON.stringify({"success": "true"}));
            } else {
              res.writeHead(401,{"Content-Type": "application/json"});
              res.end(JSON.stringify({"success": "false. File already exists"}));
            }
          });
        }
      }

      // PUT
      if (req.method === "PUT"){
        fs.readFile(`./public${req.url}`, 'utf8',function(err, data){
          if(err){
            res.writeHead(500,{"Content-Type": "application/json"});
            res.end(JSON.stringify({"error": `resource ${req.url} does not exist`}));
          }
          else {
            edit(`./public${req.url}`,name, symbol, number, description);
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify({"success": "true"}));
          }
        });
      }

      // DELETE
      if (req.method === "DELETE"){
        fs.unlink(`./public${req.url}`, function(err){
          if(err){
            res.writeHead(500,{"Content-Type": "application/json"});
            res.end(JSON.stringify({"error": `resource ${req.url} does not exist`}));
          } else{
            updateIndex(name,"remove");
            res.writeHead(200,{"Content-Type": "application/json"});
            res.end(JSON.stringify({"success": "true"}));
          }
        });
      }
    }
  });
});

server.listen(3000, () => {
  console.log("Server started on port 3000");
});
