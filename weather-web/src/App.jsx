import './App.css'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import searchicon from './assets/search.png'
import humidityicon from './assets/humidityicon.png'
import windicon from './assets/wind.png'

const WeatherDetails = ({ icon, temp, city, country, lat, log, wind, humidity }) => {
    return (
        <>
            <div className="image">
                <img src={icon} alt="" width={200} />
            </div>
            <div className="temp">
                <h1>{temp}°C</h1>
            </div>
            <div className="location">
                <h2>{city}</h2>
            </div>
            <div className="country">
                <h3>{country}</h3>
            </div>
            <div className="cord">
                <div>
                    <span className='lat'>latitude</span>
                    <span>{lat}</span>
                </div>
                <div>
                    <span className='log'>longitude</span>
                    <span>{log}</span>
                </div>
            </div>
            <div className="data-container">
                <div className="element">
                    <img src={humidityicon} alt="" width={50} className='icon' />
                    <div className="data">
                        <div className="humidity-percent">
                            <div>{humidity}</div>
                            <div>Humidity</div>
                        </div>
                    </div>
                </div>
                <div className="element">
                    <img src={windicon} alt="" width={50} className='icon' />
                    <div className="data">
                        <div className="wind-percent">
                            <div>{wind} k/h</div>
                            <div>wind Speed</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
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
            setCitynotfound(false);
            console.log(data);
        } catch (err) {
            console.error("Error fetching weather data:", err);
            setCitynotfound(true);
            return;
        }
        finally {
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
    },[]);
    return (
        <>
            {/* <img src={sunimg} alt="" /> */}
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
               {!loading && !citynotfound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} wind={wind} humidity={humidity} />}
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
