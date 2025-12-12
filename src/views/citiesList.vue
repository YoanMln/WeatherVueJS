<script setup>
import { ref, onMounted } from "vue";
import City from "@/components/City.vue";

const cities = ref([]);
const loading = ref(false);
const error = ref(null);

const API_KEY = "160ea62556fee24be34561eb778643b1";

async function fetchCitiesWeather() {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/find?lat=45.758&lon=4.765&cnt=20&cluster=yes&lang=fr&units=metric&APPID=${API_KEY}`
    );
    if (!response.ok) throw new Error("Erreur lors de la requête");

    const data = await response.json();
    cities.value = data.list;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchCitiesWeather();
});
</script>



<template>
  <div class="container-title">
    
    
  </div>
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
 ;
  
}
</style>
