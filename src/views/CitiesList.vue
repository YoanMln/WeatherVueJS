<script setup>
import { ref, onMounted, watch } from "vue";
import City from "@/components/City.vue";
import RegionSelector from "@/components/RegionSelector.vue";
import { getWeatherByCities } from "@/services/weatherService";

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

async function fetchMultipleCities(cityNames) {
  loading.value = true;
  error.value = null;

  try {
    cities.value = await getWeatherByCities(cityNames);
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
  <RegionSelector v-model="selectedRegion" :regions="regions" />

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

<style lang="scss">
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
