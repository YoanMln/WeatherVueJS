<script setup>
import City from "@/components/City.vue";
</script>

<template>
  <City
    name="Annecy"
    weather="Ensoleillé"
    :temperature="8"
    updatedAt="Il y a 5 minutes"
  />
</template>