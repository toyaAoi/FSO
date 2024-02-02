import { useState, useEffect } from "react";
import axios from "axios";

const Country = ({ country, weather }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital}</div>
      <div>area {country.area}</div>
      <br />

      <h3>languages:</h3>
      <ul>
        {Object.entries(country.languages).map((language) => {
          return <li key={language[0]}>{language[1]}</li>;
        })}
      </ul>

      <img
        src={country.flags.png}
        alt={country.name.common + " flag"}
        width="200"
      />

      <h2>Weather in {country.capital[0]}</h2>
      <p>temperature {weather?.temp} Celsius</p>
      <img src={weather?.iconURL} alt="" />
      <p>wind {weather?.wind} m/s</p>
    </div>
  );
};

const Countries = ({ countries, setFiltered, weather }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  } else if (countries.length < 10 && countries.length > 1) {
    return (
      <div>
        {countries.map((country) => (
          <div key={country.name.common}>
            {country.name.common}
            <button onClick={() => setFiltered([country])}>show</button>
          </div>
        ))}
      </div>
    );
  } else if (countries.length === 1) {
    return <Country country={countries[0]} weather={weather} />;
  }
};

function App() {
  const [countries, setCountries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [weather, setWeather] = useState(null);
  const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/";

  console.log(filtered);

  useEffect(() => {
    axios.get(baseUrl + "all").then((response) => setCountries(response.data));
  }, []);

  useEffect(() => {
    if (filtered.length === 1) {
      const [lat, lon] = filtered[0].capitalInfo.latlng;
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${
            import.meta.env.VITE_API_KEY
          }`
        )
        .then((response) => {
          console.log(response);
          const object = {
            temp: (response.data.main.temp - 273.15).toFixed(2),
            iconURL: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
            wind: response.data.wind.speed,
          };
          setWeather(object);
        });
    }
  }, [filtered]);

  if (countries.length === 0) return;

  const handleChange = (value) => {
    setKeyword(value);
    if (value === "") {
      setFiltered([]);
    } else {
      setFiltered(
        countries.filter((country) =>
          country.name.common.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  return (
    <div>
      find countries
      <input
        type="text"
        value={keyword}
        onChange={(e) => handleChange(e.target.value)}
      />
      <Countries
        countries={filtered}
        setFiltered={setFiltered}
        weather={weather}
      />
    </div>
  );
}

export default App;
