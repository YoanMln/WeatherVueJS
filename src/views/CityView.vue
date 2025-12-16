<script setup>
  import { ref, onMounted } from "vue";
  import City from "@/components/City.vue";
  import { getWeatherByCity } from "@/services/weatherService"; 
  
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  
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
  
      cityName.value = data.name;
      weather.value = data.weather[0].description;
      temperature.value = Math.round(data.main.temp);
      updatedAt.value = new Date(data.dt * 1000).toLocaleTimeString("fr-FR");
    } catch (err) {
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
        <button @click="changeCity('Tokyo')" class="city-btn">Tokyo</button>
      </div>

      <div class="search-title">
        <h2>Rechercher une ville :</h2>
      </div>
      <div class="search">
        <input
          v-model="cityName"
          @keyup.enter="fetchWeather(cityName)"
          placeholder="Entrez une ville..."
          class="search-input"
        />
        <button @click="fetchWeather(cityName)" class="search-btn">
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
      v-else
      :name="cityName"
      :weather="weather"
      :temperature="temperature"
      :updatedAt="updatedAt"
    />
  </div>
</template>

<style scoped lang="scss">
.city-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
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
  color: white;
}

::placeholder {
  color: white;
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
