<script setup>
import { ref, onMounted } from "vue";
import City from "@/components/City.vue";
import { getWeatherByCity } from "@/services/weatherService";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const forecast = ref([]);
const cityName = ref("Annecy");
const weather = ref("");
const temperature = ref(0);
const updatedAt = ref("");
const loading = ref(false);
const error = ref(null);

const fetchWeather = async (city) => {
  loading.value = true;
  error.value = null;

  try {
    const data = await getWeatherByCity(city);

    cityName.value = data.city.name;
    forecast.value = data.list
      .filter((item, index) => index % 8 === 0)
      .slice(1, 6);
    weather.value = data.list[0].weather[0].description;
    temperature.value = Math.round(data.list[0].main.temp);
    updatedAt.value = new Date(data.list[0].dt * 1000).toLocaleTimeString(
      "fr-FR"
    );
  } catch (err) {
    clearTimeout(timeout);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
onMounted(() => {
  fetchWeather("Annecy");
});

const changeCity = (newCity) => {
  fetchWeather(newCity);
};
</script>

<template>
  <div class="city-view">
    <div class="city-selector">
      <div class="title">
        <h1>🌍 Météo en temps réel</h1>
      </div>
      <div class="select-title">
        <h2>Sélectionner une ville</h2>
      </div>
      <div class="buttons">
        <button @click="changeCity('Annecy')" class="city-btn">Annecy</button>
        <button @click="changeCity('Paris')" class="city-btn">Paris</button>
        <button @click="changeCity('Lyon')" class="city-btn">Lyon</button>
        <button @click="changeCity('Marseille')" class="city-btn">
          Marseille
        </button>
      </div>

      <div class="search-title">
        <h2>Rechercher une ville :</h2>
      </div>
      <div class="search">
        <input
          v-model="cityName"
          @keyup.enter="fetchWeather(cityName.value)"
          placeholder="Entrez une ville..."
          class="search-input"
        />
        <button @click="fetchWeather(cityName.value)" class="search-btn">
          Rechercher
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <p>Chargement de la météo...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <City
      :name="cityName"
      :weather="weather"
      :temperature="temperature"
      :updatedAt="updatedAt"
    />

    <div class="forecast-container">
      <h2>Prévisions pour {{ cityName }}</h2>
      <div class="forecast-grid">
        <div v-for="day in forecast" :key="day.dt" class="forecast-card">
          <h3>
            {{
              new Date(day.dt * 1000).toLocaleDateString("fr-FR", {
                weekday: "long",
              })
            }}
          </h3>
          <p>{{ day.weather[0].description }}</p>
          <p>{{ Math.round(day.main.temp) }}°C</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.city-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.forecast-container {
  text-align: center;
  @include card;
  margin-bottom: 1rem;
  margin-top: 2rem;
  padding: 20px;
  margin: 10px;
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.forecast-card {
  @include card;
  padding: 2rem;
  text-align: center;
}

.buttons {
  display: flex;
  gap: 20px;
}

.search {
  display: flex;
  gap: 10px;
  align-items: center;
}

input {
  padding: 10px;
  height: 20px;
  font-size: 15px;
  @include card;
  color: black;
}

::placeholder {
  color: black;
}

.search-btn {
  padding: 10px;
}

button {
  @include card;
  padding: 20px;
  font-size: 20px;
}
</style>
