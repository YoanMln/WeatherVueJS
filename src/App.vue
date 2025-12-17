<script setup>
import { RouterView } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { getWeatherByCoords } from "./services/weatherService";

const weatherMain = ref(null);
const isLoading = ref(true);

onMounted(() => {
  if (!navigator.geolocation) {
    weatherMain.value = "default";
    isLoading.value = false;
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const data = await getWeatherByCoords(latitude, longitude);
        weatherMain.value = data.weather[0].main;
      } catch (err) {
        console.log("erreur background météo", err);
        weatherMain.value = "default";
      } finally {
        isLoading.value = false;
      }
    },
    () => {
      weatherMain.value = "default";
    }
  );
});

const weatherClass = computed(() => {
  if (!weatherMain.value) return "bg-none";

  const map = {
    Clear: "bg-clear",
    Clouds: "bg-clouds",
    Rain: "bg-rain",
    Snow: "bg-snow",
    Thunderstorm: "bg-storm",
    default: "bg-default",
  };
  return map[weatherMain.value] || "bg-default";
});
</script>

<template>
  <div id="app" :class="weatherClass">
    <div class="app">
      <div v-if="isLoading" class="spinner">
        <div class="spinner-circle"></div>
        <p>Chargement en cours</p>
      </div>
      <nav v-else>
        <router-link to="/">Carte</router-link>
        <router-link to="/villes">Liste des Villes</router-link>
        <router-link to="/ville">Ville</router-link>
      </nav>

      <RouterView v-if="!isLoading"></RouterView>
    </div>
  </div>
</template>

<style lang="scss">
#app {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.app {
  height: 100vh;
  overflow-y: auto;
}

.title {
  text-align: center;
}

nav {
  display: flex;
  justify-content: space-around;
  margin-top: 3rem;
  font-weight:700;
}
</style>
