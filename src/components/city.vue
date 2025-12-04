<script setup>
import { reactive } from "vue";

const city = reactive({
  name: "Annecy",
  weather: "Nuageux",
  temperature: "8 degrés",
  updateAt: new Date(),
});
</script>

<template>
  <div class="city-container">
    <h1>{{ city.name }}</h1>
    <p>Météo {{ city.weather }}</p>
    <p>Température {{ city.temperature }}</p>
    <p>MAJ {{ city.updateAt.toLocaleString() }}</p>
  </div>
</template>

<style scoped lang="scss">
.city-container {
  text-align: center;
  margin-top: 5rem;
  padding: 1rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 300px;
  @include card;
}
h1 {
  color: white;
}
</style>
