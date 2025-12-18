const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const URL_FORECAST = "https://api.openweathermap.org/data/2.5/forecast";

async function fetchWeather(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Ville non trouvée");
  }

  return response.json();
}

// Recupere les data pour une ville + prévisions //
export async function getWeatherByCity(city) {
  const url = `${URL_FORECAST}?q=${city}&appid=${API_KEY}&units=metric&lang=fr&cnt=40`;
  return fetchWeather(url);
}

// Recupere les data pour plusieurs villes //
export async function getWeatherByCities(cities) {
  const requests = cities.map((city) => getWeatherByCity(city));
  return Promise.all(requests);
}

// Par géolocalisation //
export async function getWeatherByCoords(lat, lon) {
  const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`;
  return fetchWeather(url);
}
