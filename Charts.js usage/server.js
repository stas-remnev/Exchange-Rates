var http = require('http');



const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});


server.listen(6575, function () {
    console.log('Example app listening on port 3000!');
});
