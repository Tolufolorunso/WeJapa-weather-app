const fs = require('fs');

module.exports.serveStaticFile = (res, path, contentType, responseCode) => {
	if (!responseCode) responseCode = 200;
	fs.readFile(__dirname + path, function (error, data) {
		if (error) {
			res.writeHead(responseCode, {
				'Content-Type': contentType
			});
			res.end(data);
		} else {
			res.writeHead(responseCode, {
				'Content-Type': contentType
			});
			res.end(data);
		}
	});
};
module.exports.serveJson = (res, data, contentType, responseCode) => {
	if (!responseCode) responseCode = 200;
	data = JSON.stringify(data);
	res.writeHead(responseCode, {
		'Content-Type': contentType
	});
	res.end(data);
};
