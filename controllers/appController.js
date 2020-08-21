const { serveStaticFile, serveJson } = require('../service');
const https = require('https');

module.exports.home = res => {
	serveStaticFile(res, '/index.html', 'text/html', 200);
};

module.exports.getCity = (response, data) => {
	const api = {
		key: 'd2d2d256214cf836218a23bd385446f5'
	};

	// const searchedData = data.city.split(' ').filter(el => {
	// 	return el !== '';
	// });
	let url;
	let searchedData;

	if (data.city) {
		searchedData = data.city.split(' ').filter(Boolean);
		const [city, country] = searchedData;
		if (country && city) {
			url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${api.key}`;
		}
		if (searchedData.length === 1) {
			url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api.key}`;
		}
	} else {
		url = `https://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.lng}&appid=${api.key}`;
	}

	// serveStaticFile(response, '/_data/api.json', 'application/json', 200);

	https.get(url, res => {
		res.setEncoding('utf8');
		const { statusCode } = res;
		let body = '';
		res.on('data', data => {
			body += data;
		});
		res.on('end', () => {
			body = JSON.parse(body);
			if (body.cod === '404') {
				body.status = 'fail';
				serveJson(response, body, 'application/json', 404);
			}
			serveJson(response, body, 'application/json', 200);
		});
	});
};
