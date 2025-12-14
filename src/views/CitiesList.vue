<script setup>
import { ref, onMounted, watch } from "vue";
import City from "@/components/City.vue";

const regions = ["Auvergne-Rhône-Alpes", "Île-de-France", "PACA"];
const citiesByRegion = {
  "Auvergne-Rhône-Alpes": ["Annecy", "Grenoble", "Lyon"],
  "Île-de-France": ["Paris", "Versailles", "Boulogne-Billancourt"],
  PACA: ["Marseille", "Nice", "Toulon"],
};
const selectedRegion = ref("Auvergne-Rhône-Alpes");

const cities = ref([]);
const loading = ref(false);
const error = ref(null);

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

async function fetchMultipleCities(cityNames) {
  loading.value = true;
  error.value = null;

  try {
    const promises = cityNames.map((city) =>
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fr`
      )
    );
    const responses = await Promise.all(promises);
    const dataPromises = responses.map((response) => response.json());
    const allCitiesData = await Promise.all(dataPromises);

    cities.value = allCitiesData;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchMultipleCities(citiesByRegion[selectedRegion.value]);
});

watch(selectedRegion, (newRegion) => {
  if (newRegion) {
    fetchMultipleCities(citiesByRegion[newRegion]);
  }
});
</script>

<template>
  <select v-model="selectedRegion" name="Region">
    <option value="" disabled selected>Sélectionnez une région</option>
    <option v-for="region in regions" :key="region" :value="region">
      {{ region }}
    </option>
  </select>
  <p>Région choisie : {{ selectedRegion }}</p>
  <div class="container-title"></div>
  <p v-if="loading">Requête en cours...</p>
  <p v-if="error" style="color: red">{{ error }}</p>
  <div class="city-container">
    <City
      v-for="city in cities"
      :key="city.id"
      :name="city.name"
      :weather="city.weather[0].description"
      :temperature="city.main.temp"
      :updatedAt="new Date(city.dt * 1000).toLocaleTimeString()"
    />
  </div>
</template>

<style scoped>
.container-title {
  text-align: center;
}

.city-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 0;
}
</style>
