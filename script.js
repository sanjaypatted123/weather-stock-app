// ✨ API KEYS (Replace 'YOUR_API_KEY' with your real API keys)
const WEATHER_API_KEY = '6fc5d41d0c988864a32a52368869d40e';
const STOCK_API_KEY = 'd085pphr01qpb1gqgs4gd085pphr01qpb1gqgs50';

// Getting DOM elements
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');
const stockResult = document.getElementById('stockResult');

// Listen for click event
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if(city) {
    getWeather(city);
  }
});

// Fetch weather data
async function getWeather(city) {
  try {
    weatherResult.innerHTML = "Loading weather...";
    stockResult.innerHTML = "";

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;

    const response = await fetch(weatherUrl);
    const data = await response.json();

    if (data.cod !== 200) {
      weatherResult.innerHTML = "City not found!";
      return;
    }

    const country = data.sys.country;
    const temperature = data.main.temp;
    const weatherDescription = data.weather[0].description;

    weatherResult.innerHTML = `
      <h3>Weather in ${city}</h3>
      <p>Temperature: ${temperature}°C</p>
      <p>Condition: ${weatherDescription}</p>
      <p>Country: ${country}</p>
    `;

    // Fetch stock data after weather
    getStock(country);

  } catch (error) {
    weatherResult.innerHTML = "Error fetching weather!";
    console.error(error);
  }
}

// Fetch stock data
async function getStock(countryCode) {
  try {
    stockResult.innerHTML = "Loading stock info...";

    // Mapping country codes to stock indices (simple version)
    const countryToStock = {
      "US": "AAPL",   // Apple (USA)
      "JP": "7203.T", // Toyota (Japan)
      "GB": "HSBA.L", // HSBC (UK)
      "IN": "INFY",   // Infosys (India)
      "DE": "BMW.DE", // BMW (Germany)
      "FR": "AIR.PA"  // Airbus (France)
      // You can add more mappings!
    };

    const stockSymbol = countryToStock[countryCode];

    if (!stockSymbol) {
      stockResult.innerHTML = "No stock data available for this country.";
      return;
    }

    const stockUrl = `https://finnhub.io/api/v1/quote?symbol=${stockSymbol}&token=${STOCK_API_KEY}`;

    const response = await fetch(stockUrl);
    const data = await response.json();

    if (data.c) { // 'c' is current price
      stockResult.innerHTML = `
        <h3>Stock Info</h3>
        <p>Company: ${stockSymbol}</p>
        <p>Current Price: $${data.c}</p>
      `;
    } else {
      stockResult.innerHTML = "Stock data not available.";
    }

  } catch (error) {
    stockResult.innerHTML = "Error fetching stock info!";
    console.error(error);
  }
}
