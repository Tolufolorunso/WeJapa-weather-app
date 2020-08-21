const http = require('http');
const { serveStaticFile } = require('./service');
const { getCity, home } = require('./controllers/appController');

module.exports = http.createServer((req, res) => {
	//GET form request and POST request
	if (req.url == '/' && req.method === 'GET') {
		home(res, 'hello');
	} else if (req.url == '/api/city' && req.method === 'POST') {
		let body = [];
		req.on('data', chunk => {
			body.push(chunk);
		});
		req.on('end', () => {
			body = Buffer.concat(body).toString();
			body = JSON.parse(body);
			getCity(res, body);
		});
	} else if (req.url == '/styles/beautify.css' && req.method === 'GET') {
		serveStaticFile(res, '/client/styles/beautify.css', 'text/css');
	} else if (req.url == '/scripts/life.js' && req.method === 'GET') {
		serveStaticFile(res, '/client/scripts/life.js', 'text/js');
	} else if (req.url == '/images/bg.jpg' && req.method === 'GET') {
		serveStaticFile(res, '/client/images/bg.jpg', 'image/jpg');
	} else {
		res.writeHead(404, {
			'Content-Type': 'text/html'
		});
		res.end('<h2>Page not found</h2>');
	}
});
