function auth(req, res) {

  var auth = req.headers['authorization'];

  console.log("Authorization Header is: ", auth);

  if(!auth) {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
    res.end('<html><body>Need some creds son</body></html>');
  }

  else if(auth) {
    var tmp = auth.split(' ');
    var buf = new Buffer(tmp[1], 'base64');
    var plain_auth = buf.toString();

    console.log("Decoded Authorization ", plain_auth);

    // At this point plain_auth = "username:password"

    var creds = plain_auth.split(':');
    var username = creds[0];
    var password = creds[1];

    if((username == 'charles') && (password == 'toto')) {   // Is the username/password correct?
      return true;
      }
    else {
      res.statusCode = 401;
      res.end('<html><body>Invalid Authentification Credentials</body></html>');
    }
  }
}

module.exports = auth;
