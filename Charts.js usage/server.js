// Подключение библиотек
var http = require('http');
var fs = require('fs');
xml2js = require('xml2js');
var inspect = require('util-inspect');

// Функция парсит локальный xml-файл
function parseMyFile() {

}

// Загрузка и сохранение удаленного файла  
var file = fs.createWriteStream("example.xml");
var request = http.get("http://www.cbr.ru/scripts/XML_daily.asp?date_req=02/03/2002", function (response) {
  response.pipe(file);
});

// Сервер
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');

  // Парсинг скачанного xml-файла
  // parseMyFile();
  var parser = new xml2js.Parser();

  fs.readFile('example.xml', function (err, data) {
    parser.parseString(data, function (err, result) {
      console.log(inspect(result, false, null));
      console.log('Done');
    });
  });
});


server.listen(6575, function () {
  console.log('Example app listening on port 6575!');
});
