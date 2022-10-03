let http = require("http");
let url = require("url");
let fs = require("fs");
http.createServer(function (response, request) {
    let addr = request.url,
        q = url.parse(addr, true),
        filePath = '';
    if (q.pathname.includes('documentation')) {
        filePath = (__dirname + '/documentation.html');
    } else {
        filePath = 'index.html';
    }
    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Added to log.');
        }

    });
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(data);
    response.end();
}).listen(8080);

