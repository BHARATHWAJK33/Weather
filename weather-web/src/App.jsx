import './App.css'
import React, { useEffect, useState } from 'react'
import Clock from './Clock'
import PropTypes from 'prop-types'
import searchicon from './assets/search.png'
import humidityicon from './assets/humidityicon.png'
import windicon from './assets/wind.png'

const WeatherDetails = ({ icon, temp, city, country, lat, log, wind, humidity, pressure, sunrise, sunset, airQuality, uv, visibility }) => {
    return (
        <div className="weather-details">
            <div className="image">
                <img src={icon} alt="Weather Icon" width={200} />
            </div>
            <h1 className="temp">{temp}°C</h1>
            <h2 className="location">{city}, {country}</h2>

            <div className="cord">
                <div className="coord-box">
                    <span className='label'>Latitude:</span>
                    <span>{lat}</span>
                </div>
                <div className="coord-box">
                    <span className='label'>Longitude:</span>
                    <span>{log}</span>
                </div>
            </div>

            <div className="data-container">
                <div className="element">
                    <img src={humidityicon} alt="Humidity" width={50} className='icon' />
                    <div className="data">
                        <div className="value">{humidity}%</div>
                        <div className="label">Humidity</div>
                    </div>
                </div>
                <div className="element">
                    <img src={windicon} alt="Wind" width={50} className='icon' />
                    <div className="data">
                        <div className="value">{wind} km/h</div>
                        <div className="label">Wind Speed</div>
                    </div>
                </div>
                <div className="element">
                    <span className="label">Pressure:</span>
                    <span>{pressure} hPa</span>
                </div>
                <div className="element">
                    <span className="label">Air Quality:</span>
                    <span>{airQuality}</span>
                </div>
                <div className="element">
                    <span className="label">Sunrise:</span>
                    <span>{sunrise}</span>
                </div>
                <div className="element">
                    <span className="label">Sunset:</span>
                    <span>{sunset}</span>
                </div>
                <div className="element">
                    <span className="label">UV Index</span>
                    <span>{uv}</span>

                </div>
                <div className="element">
                    <span className="label">Visibility:</span>
                    <span>{visibility} km</span>
                </div>
            </div>

        </div>

    )
}

WeatherDetails.propTypes = {
    icon: PropTypes.string.isRequired,
    temp: PropTypes.number.isRequired,
    city: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    lat: PropTypes.number.isRequired,
    log: PropTypes.number.isRequired,
    wind: PropTypes.number.isRequired,
    humidity: PropTypes.number.isRequired,
    pressure: PropTypes.number.isRequired,
    sunrise: PropTypes.string.isRequired,
    sunset: PropTypes.string.isRequired,
    airQuality: PropTypes.string.isRequired,
    uv: PropTypes.number.isRequired,
    visibility: PropTypes.number.isRequired
}
function App() {
    const [icon, setIcon] = useState();
    const [temp, setTemp] = useState(0);
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [lat, setLat] = useState(0);
    const [log, setLog] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [wind, setWind] = useState(0);
    const [text, setText] = useState("vellore");
    const [citynotfound, setCitynotfound] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pressure, setPressure] = useState(0);
    const [sunrise, setSunrise] = useState('');
    const [sunset, setSunset] = useState('');
    const [airQuality, setAirQuality] = useState('');
    const [uv, setUv] = useState(0);
    const [visibility, setVisibility] = useState(0);

    const searchWeather = async () => {
        setLoading(true);
        setCitynotfound(false);
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=23413137cdaaf95304d9d9d66eb2d1ed&units=Metric`;
        try {
            let res = await fetch(url);
            let data = await res.json();
            if (data.cod === '404') {
                setCitynotfound(true);
                setLoading(false);
                return;
            }

            setIcon(`http://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
            setTemp(data.main.temp);
            setCity(data.name);
            setCountry(data.sys.country);
            setLat(data.coord.lat);
            setLog(data.coord.lon);
            setHumidity(data.main.humidity);
            setWind(data.wind.speed);
            setText(data.name);
            setPressure(data.main.pressure);
            setSunrise(new Date(data.sys.sunrise * 1000).toLocaleTimeString());
            setSunset(new Date(data.sys.sunset * 1000).toLocaleTimeString());
            setVisibility((data.visibility / 1000).toFixed(1)); // visibility in km
            setUv(data.current ? data.current.uvi : 0); // UV index, if available
            // Fetch air quality
            let airRes = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=23413137cdaaf95304d9d9d66eb2d1ed`);
            let airData = await airRes.json();
            const aqi = airData.list[0].main.aqi;
            const aqiMeaning = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
            setAirQuality(aqiMeaning[aqi - 1]);

            console.log(data);
        } catch (err) {
            console.error("Error fetching weather data:", err);
            setCitynotfound(true);
        } finally {
            setLoading(false);
        }
    };

    const handelCity = (e) => {
        setText(e.target.value);
    };
    const handelKeyDown = (e) => {
        if (e.key === 'Enter') {
            searchWeather();
        }
    };

    useEffect(() => {
        searchWeather();
    }, []);
    return (
        <>
            <Clock />
            <div className="container">
                <div className="input-container">
                    <input type="text"
                        className='cityInput'
                        placeholder='Search City'
                        onChange={handelCity}
                        value={text}
                        onKeyDown={handelKeyDown} />
                    <div className="search-icon" onClick={() => searchWeather()}>
                        <img src={searchicon} alt="Search Icon" width={20} />
                    </div>
                </div>
                {!loading && !citynotfound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} wind={wind} humidity={humidity} pressure={pressure} sunrise={sunrise} sunset={sunset} airQuality={airQuality} uv={uv} visibility={visibility} />}
                {loading && <div className="loading">Loading...</div>}
                {citynotfound && <div className="city-not-found">City Not Found</div>}
                {!loading && !citynotfound && (
                    <div className="footer">
                        <p>Designed By BHARATHWAJ K</p>
                    </div>
                )}
            </div>
        </>
    )
}

export default App
