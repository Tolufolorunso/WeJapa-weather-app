const { serveStaticFile, serveJson } = require('../service');
const { api: openweatherApi } = require('./api');

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
			url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${api.key}&units=metric`;
		}
		if (searchedData.length === 1) {
			url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api.key}&units=metric`;
		}
	} else {
		url = `https://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.lng}&appid=${api.key}&units=metric`;
	}

	// serveStaticFile(response, '/_data/api.json', 'application/json', 200);
	openweatherApi(response, url);
};
