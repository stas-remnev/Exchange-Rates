var http = require('http');

var fs = require('fs');




const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');


  var file = fs.createWriteStream("example.xml");
  var request = http.get("http://www.cbr.ru/scripts/XML_daily.asp?date_req=02/03/2002", function (response) {
    response.pipe(file);
  });
});


server.listen(6575, function () {
  console.log('Example app listening on port 3000!');
});
