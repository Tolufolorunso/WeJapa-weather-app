const city = document.getElementById('city');
const cityBox = document.getElementById('city-box');
const iconUrl = document.getElementById('icon');
const cityCondition = document.getElementById('city-condition');
const degUI = document.getElementById('deg');
const table = document.getElementById('table');
const hr = document.getElementById('hour');
const min = document.getElementById('minute');
const sec = document.getElementById('second');
const date = document.getElementById('date');
const apUi = document.getElementById('ap');
const alert = document.getElementById('alert');

let latitudeDefault, longitudeDefault;

const loadDefaultWeather = () => {
	const defaultCity = {
		city: 'Ijero-ekiti'
	};

	latitudeDefault = 7.7;
	longitudeDefault = 5.28;

	fetchWeatherDetal(defaultCity)
		.then(data => {
			displayData(data);
		})
		.catch(error => showAlert('fail', error.message));
};

const showAlert = (alertType, alertMessage) => {
	var alertDiv = document.getElementById('alert');
	var alertParagraph = document.getElementById('alert-p');

	if (alertType === 'success') {
		alertParagraph.textContent = alertMessage;
		alertDiv.style.background = 'green';
		alertDiv.style.opacity = 1;
	} else {
		alertParagraph.textContent = alertMessage;
		alertDiv.style.background = 'red';
		alertDiv.style.opacity = 1;
	}

	setTimeout(function () {
		alertParagraph.textContent = '';
		alertDiv.style.background = '';
		alertDiv.style.opacity = 0;
	}, 2000);
};

const displayData = data => {
	const {
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
	} = data;

	latitudeDefault = latitude;
	longitudeDefault = longitude;
	map(longitudeDefault, latitudeDefault);

	// console.log(
	// 	cityName,
	// 	latitude,
	// 	longitude,
	// 	country,
	// 	main,
	// 	description,
	// 	icon,
	// 	temp,
	// 	deg,
	// 	sunrise,
	// 	sunset
	// );

	let sec, date, localTime;

	if (country !== 'NG') {
		sec = sunrise;
		date = new Date(sec * 1000);
		localTime = date.toLocaleTimeString();
	} else {
		date = new Date();
		localTime = date.toLocaleTimeString();
	}

	table.innerHTML = `
	<table>
         <tr>
            <td>Country</td>
            <td>${country}</td>
        </tr>
            <tr>
                <td>Latitude</td>
                <td>${latitude}</td>
            </tr>
            <tr>
                <td>Longitude</td>
                <td>${longitude}</td>
            </tr>
            <tr>
                <td>Description</td>
                <td>${description}</td>
            </tr>
            <tr>
                <td>Temperature</td>
                <td>${temp}</td>
			</tr>
			<tr>
                <td>Date</td>
                <td>${date.toLocaleDateString()}</td>
			</tr>
			<tr>
                <td>Local Time</td>
                <td>${localTime}</td>
            </tr>
        </table>
	`;

	degUI.innerHTML = `${temp} <sup>0</sup>C`;
	cityCondition.textContent = main;
	cityCondition.classList.add('city-condition');
	cityBox.textContent = cityName;
	const iconSrc = `http://openweathermap.org/img/w/${icon}.png`;
	iconUrl.setAttribute('src', iconSrc);
};

const displayTime = () => {
	const now = new Date();
	let hour = now.getHours();
	let minutes = now.getMinutes();
	let seconds = now.getSeconds();
	const todayDate = now.toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	let ap = 'AM';
	if (hour > 11) ap = 'PM';
	if (hour > 12) hour = hour - 12;
	if (hour === 0) hour = 12;
	seconds = seconds < 10 ? '0' + seconds : seconds;
	minutes = minutes < 10 ? '0' + minutes : minutes;
	date.textContent = todayDate;
	hr.textContent = hour;
	min.textContent = minutes;
	sec.textContent = seconds;
	apUi.textContent = ap;
};

const fetchWeatherDetal = async body => {
	const response = await fetch('/api/city', {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	});
	if (response.ok) {
		const data = await response.json();
		return data;
	} else {
		const data = await response.json();
		throw Error(data.message);
	}
};

document.getElementById('search').addEventListener('submit', evt => {
	let { name, value } = evt.target;
	evt.preventDefault();
	if (city.value === '') {
		showAlert('green', 'Enter a city name');
		return false;
	}

	const body = {
		city: city.value
	};

	fetchWeatherDetal(body)
		.then(data => {
			displayData(data);
		})
		.catch(error => {
			showAlert('success', error.message);
		});
	city.value = '';
});

const map = (longitudeDefault, latitudeDefault) => {
	mapboxgl.accessToken =
		'pk.eyJ1IjoidG9sZm9sb3J1bnNvIiwiYSI6ImNrZTFsbXk0MzAwbjgzMHA2bm82Mm9kdWIifQ.WmgYZmUX1brBeTWUbEu5qA';
	var map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/streets-v11',
		center: [longitudeDefault, latitudeDefault],
		zoom: 9
	});
	map.on('click', function (evt) {
		let i = JSON.stringify(evt.point);
		const { lng, lat } = evt.lngLat.wrap();
		const body = {
			lng,
			lat
		};

		fetchWeatherDetal(body)
			.then(data => {
				displayData(data);
			})
			.catch(error => console.log(error));
	});
};

loadDefaultWeather();
setInterval(displayTime, 1000);
map(longitudeDefault, latitudeDefault);
