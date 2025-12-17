<script setup>
import "leaflet/dist/leaflet.css";
import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LTooltip,
} from "@vue-leaflet/vue-leaflet";
import { ref, onMounted } from "vue";
import L from "leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const cities = ref([]);
const selectedCity = ref(null);
const showAddForm = ref(false);
const cityName = ref("");
const isLoading = ref(false);
const errorMessage = ref("");

const getWeatherIcon = (weather, isNight = false) => {
  const icons = {
    sun: isNight ? "🌑" : "☀️",
    cloud: isNight ? "☁️🌑" : "☁️",
    rain: "🌧️",
    snow: "❄️",
    storm: "⛈️",
  };
  return icons[weather] || (isNight ? "🌑" : "🌤️");
};

const getWeatherText = (weather, isNight = false) => {
  const texts = {
    sun: isNight ? "Nuit claire" : "Ensoleillé",
    cloud: isNight ? "Nuageux (nuit)" : "Nuageux",
    rain: "Pluvieux",
    snow: "Neigeux",
    storm: "Orageux",
  };
  return (
    texts[weather] ||
    (isNight ? "Nuit partiellement nuageuse" : "Partiellement nuageux")
  );
};

const getWeatherType = (main, icon) => {
  const isNight = icon?.includes("n");
  const type =
    main === "Clear"
      ? "sun"
      : main === "Clouds"
      ? "cloud"
      : main === "Rain" || main === "Drizzle"
      ? "rain"
      : main === "Snow"
      ? "snow"
      : main === "Thunderstorm"
      ? "storm"
      : "cloud";
  return { type, isNight };
};

const selectCity = (city) => {
  selectedCity.value = city;
  console.log("Ville sélectionnée:", city);
};

const toggleAddForm = () => {
  showAddForm.value = !showAddForm.value;
  errorMessage.value = "";
};

const addCityByName = async () => {
  if (!cityName.value.trim()) {
    errorMessage.value = "Veuillez entrer un nom de ville";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const geoResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        cityName.value
      )}&limit=1`
    );

    const geoData = await geoResponse.json();

    if (geoData.length === 0) {
      errorMessage.value = "Ville non trouvée. Vérifiez l'orthographe.";
      isLoading.value = false;
      return;
    }

    const cityData = geoData[0];
    const lat = parseFloat(cityData.lat);
    const lon = parseFloat(cityData.lon);

    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`
    );

    const weatherData = await weatherResponse.json();
    const weatherInfo = getWeatherType(
      weatherData.weather[0].main,
      weatherData.weather[0].icon
    );

    const newCity = {
      id: Date.now(),
      name: cityData.display_name.split(",")[0],
      lat: lat,
      lon: lon,
      weather: weatherInfo.type,
      isNight: weatherInfo.isNight,
      temperature: Math.round(weatherData.main.temp),
      description: weatherData.weather[0].description,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      updatedAt: new Date(weatherData.dt * 1000).toLocaleTimeString("fr-FR"),
    };

    cities.value.push(newCity);

    cityName.value = "";
    showAddForm.value = false;
  } catch (error) {
    errorMessage.value =
      "Erreur lors de la recherche de la ville ou de la météo";
    console.error("Erreur:", error);
  } finally {
    isLoading.value = false;
  }
};

const removeCity = (cityId) => {
  cities.value = cities.value.filter((city) => city.id !== cityId);
};

onMounted(async () => {
  const initialCities = [
    { name: "Annecy", lat: 45.8992, lon: 6.1294 },
    { name: "Lyon", lat: 45.764, lon: 4.8357 },
    { name: "Paris", lat: 48.8566, lon: 2.3522 },
  ];

  for (const city of initialCities) {
    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric&lang=fr`
      );
      const weatherData = await weatherResponse.json();

      const weatherInfo = getWeatherType(
        weatherData.weather[0].main,
        weatherData.weather[0].icon
      );

      cities.value.push({
        id: Date.now() + Math.random(),
        name: city.name,
        lat: city.lat,
        lon: city.lon,
        weather: weatherInfo.type,
        isNight: weatherInfo.isNight,
        temperature: Math.round(weatherData.main.temp),
        description: weatherData.weather[0].description,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        updatedAt: new Date(weatherData.dt * 1000).toLocaleTimeString("fr-FR"),
      });
    } catch (error) {
      console.error(`Erreur lors du chargement de ${city.name}:`, error);
    }
  }
});
</script>

<template>
  <div class="map-container">
    <div class="container-header">
      <div class="map-header">
        <h1 class="title">🗺️ Météo des villes</h1>
        <div class="header-actions">
          <div class="city-count">{{ cities.length }} villes</div>
          <button @click="toggleAddForm" class="add-btn">
            {{ showAddForm ? "✖ Fermer" : "➕ Ajouter une ville" }}
          </button>
        </div>
      </div>

      <div v-if="showAddForm" class="add-form">
        <h3>🏙️ Ajouter une nouvelle ville</h3>
        <div class="simple-form">
          <input
            v-model="cityName"
            type="text"
            placeholder="Entrez le nom de la ville (ex: Paris, Tokyo, New York)"
            @keyup.enter="addCityByName"
            class="city-input"
          />

          <div v-if="errorMessage" class="error-message">
            ⚠️ {{ errorMessage }}
          </div>

          <button
            @click="addCityByName"
            class="submit-btn"
            :disabled="isLoading"
          >
            {{ isLoading ? "Recherche de la météo..." : " Ajouter la ville" }}
          </button>
        </div>
      </div>

      <div class="cities-list" v-if="cities.length > 0">
        <h3>📍 Villes enregistrées</h3>
        <div class="city-item" v-for="city in cities" :key="city.id">
          <span class="city-name">{{ city.name }}</span>
          <div class="city-info">
            <span class="city-weather">{{
              getWeatherIcon(city.weather, city.isNight)
            }}</span>
            <span class="city-temp" v-if="city.temperature"
              >{{ city.temperature }}°C</span
            >
          </div>
          <button @click="removeCity(city.id)" class="remove-btn">🗑️</button>
        </div>
      </div>
    </div>

    <div id="map">
      <l-map
        style="height: 100%; width: 100%"
        :zoom="6"
        :center="[46.5, 2.5]"
        :options="{ zoomControl: true }"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        ></l-tile-layer>

        <l-marker
          v-for="city in cities"
          :key="city.id"
          :lat-lng="[city.lat, city.lon]"
        >
          <l-tooltip :options="{ permanent: false, direction: 'top' }">
            {{ city.name }}
          </l-tooltip>

          <l-popup>
            <div class="popup-content">
              <h3>{{ city.name }}</h3>
              <div class="weather-info">
                <span class="weather-icon">{{
                  getWeatherIcon(city.weather, city.isNight)
                }}</span>
                <div class="weather-details">
                  <span class="weather-text">{{
                    getWeatherText(city.weather, city.isNight)
                  }}</span>
                  <span class="weather-temp" v-if="city.temperature">
                    {{ city.temperature }}°C
                  </span>
                  <span class="weather-desc" v-if="city.description">
                    {{ city.description }}
                  </span>
                </div>
              </div>

              <div class="extra-info" v-if="city.humidity">
                <p>💧 Humidité: {{ city.humidity }}%</p>
                <p>🌬️ Vent: {{ city.windSpeed }} m/s</p>
                <p>🕐 MAJ: {{ city.updatedAt }}</p>
              </div>
            </div>
          </l-popup>
        </l-marker>
      </l-map>
    </div>
  </div>
</template>

<style scoped lang="scss">
.title {
  font-size: 25px;
}

.map-container {
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.container-header {
  background: transparent;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  @include card;
  color: black;
}

.map-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.city-count {
  @include card;
  padding: 10px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 15px;
}

.add-btn {
  @include card;
  color: black;
  padding: 10px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 1s;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.add-form {
  @include card;

  padding: 2rem;
}

.add-form h3 {
  margin: 0 0 1.5rem 0;
  color: black;
}

.simple-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.city-input {
  padding: 0.9rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
  @include card;
}

::placeholder {
  color: black;
}

.city-input:focus {
  outline: none;
  border-color: #667eea;
}

.error-message {
  padding: 0.8rem;
  background: #ffe0e0;
  color: #d32f2f;
  border-radius: 8px;
  font-weight: 500;
}

.submit-btn {
  @include overlay;
  color: white;
  border: none;
  padding: 10px;

  border-radius: 10px;
  margin: 0 auto;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cities-list {
  padding: 1.5rem;
  @include card;

  border-bottom: 1px solid #e0e0e0;
}

.cities-list h3 {
  margin: 0 0 1rem 0;
  color: black;
  font-size: 1.1rem;
}

.city-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  margin-bottom: 0.5rem;
  transition: all 0.3s;
  @include card;
}

.city-item:hover {
  transform: translateX(5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.city-name {
  flex: 1;
  font-weight: 600;
  color: black;
}

.city-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.city-weather {
  font-size: 1.5rem;
}

.city-temp {
  font-weight: 600;
  color: black;
  font-size: 1.1rem;
}

.remove-btn {
  background: #ff475698;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
}

.remove-btn:hover {
  background: #ee5a6f;
  transform: scale(1.1);
}

#map {
  height: 600px;
  width: 100%;
  position: relative;
}
</style>
