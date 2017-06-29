var http = require('http');
var fs = require('fs'),
    xml2js = require('xml2js');
var inspect = require('util-inspect');

var parser = new xml2js.Parser();

function r(a) {
    fs.readFile(a, function (err, data) {
        parser.parseString(data, function (err, result) {
            console.log(inspect(result, false, null));
            console.log('Done');
        });
    });
}

var file = fs.createWriteStream("example.xml");
var str; 
var now = new Date(); 
var d = now.getDate();
var m = now.getMonth();
var y = now.getFullYear();
var zn = 1;
var na = 1;
if (d<10) {d="0"+d};
m=m+1;
if (m<9) { m="0"+m};
//for (var nd =1; nd<5; nd++) {
var request = http.get("http://www.cbr.ru/scripts/XML_dynamic.asp?date_req1="+d+"/"+m+"/"+(y-5)+"&date_req2="+d+"/"+m+"/"+y+"&VAL_NM_RQ=R01235", function (res) {
    str = '';
      res.setEncoding('utf8');
  res.on('data', function (chunk) {
      str = str + chunk;    
  });

  res.on('end', function() {
        str2 = str;
        var k = (str2.split('Nominal').length-1);
        k = k/2;
        var arr = new Array(); 
        var arr1 = new Array();
        var arr2 = new Array();
        var arr3 = new Array();
   var  str1 = str.match(/.Value.*,*.Value./g);
    arr = str1.toString().split('</Value>');
    for (var i = 0; i < k; i++)
    { arr1[i] = arr[i].replace(/\D/g, '')/10000; }
   console.log(arr1);
   fs.open("baks.txt", "a", 0644, function(err, file_handle) {
    if (!err) {
    // Записываем в конец файла readme.txt фразу "Copyrighted by Me"
    // при открытии в режиме "a" указатель уже в конце файла, и мы передаём null
    // в качестве позиции
    fs.write(file_handle, arr1, null, 'ascii', function(err, written) {
        if (!err) {
            // Всё прошло хорошо
        } else {
            // Произошла ошибка при записи
        }
    });
} else {
    // Обработка ошибок при открытии
}
});


}); 

 });


const server = http.createServer((req, res) => {   
    fs.readFile('baks.txt', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
 });
});

server.listen(8080, function () {
    

    console.log('Example app listening on port 8080!');

});
