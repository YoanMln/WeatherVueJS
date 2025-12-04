<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  weather: {
    type: String,
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  updatedAt: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="city-container">
    <h1>{{ name }}</h1>
    <p>Météo : {{ weather }}</p>
    <p>Température : {{ temperature }}°C</p>
    <p>MAJ : {{ updatedAt }}</p>
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
