const https = require('https');
const { serveStaticFile, serveJson } = require('../service');

const sendWeatherData = (response, data) => {
	const {
		name: cityName,
		coord: { lat: latitude, lon: longitude },
		sys: { country, sunrise, sunset },
		weather: [weatherDetail],
		main: { temp },
		wind: { deg }
	} = data;
	const { main, icon, description } = weatherDetail;
	const body = {
		cityName,
		latitude,
		longitude,
		country,
		main,
		description,
		icon,
		temp,
		deg,
		sunrise,
		sunset
	};

	console.log(body);
	serveJson(response, body, 'application/json', 200);
};

module.exports.api = (response, url) => {
	console.log(response, url);
	https.get(url, res => {
		res.setEncoding('utf8');
		const { statusCode } = res;
		console.log(statusCode);
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
			sendWeatherData(response, body);
		});
	});
};
