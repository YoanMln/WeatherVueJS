<script setup>
import City from "@/components/City.vue";
import { reactive } from "vue";
const cities = reactive([
  {
    id: 1,
    name: "Annecy",
    weather: "Ensoleillé",
    temperature: 8,
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Ville",
    weather: "Peu nuageux",
    temperature: 5,
    updatedAt: new Date(),
  },
]);
</script>

<template>
  <h1>Weather - List of cities</h1>

  <City
    v-for="city in cities"
    :key="city.id"
    :name="city.name"
    :weather="city.weather"
    :temperature="city.temperature"
    :updatedAt="city.updatedAt"
  />
</template>
