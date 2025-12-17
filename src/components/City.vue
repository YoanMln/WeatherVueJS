<script setup>
import { format } from "timeago.js";
import { computed } from "vue";

const props = defineProps({
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
    type: [Date, String],
    required: true,
  },
});

const formattedDate = computed(() => {
  if (props.updatedAt instanceof Date) {
    return format(props.updatedAt, "fr");
  }
  return props.updatedAt;
});
</script>

<template>
  <div class="cards-container">
    <div class="city-card">
      <h1>📍{{ name }}</h1>
      <p>Météo: {{ weather }}</p>
      <p>Température: {{ temperature }}°C</p>
      <p>Mise à jour: {{ formattedDate }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cards-container {
  border-radius: 20px;
  padding: 1.2rem;
  margin: 0 auto;
  margin-top: 5rem;
  width: 350px;
  @include card-container;

  .city-card {
    @include city-card;
    font-size: 16px;
    font-weight: 700;
    border-radius: 20px;
    text-align: center;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
  }
}
</style>
