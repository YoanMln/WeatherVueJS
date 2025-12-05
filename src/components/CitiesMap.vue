<script setup>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import { ref, onMounted } from "vue";
import L from "leaflet";

 
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const cities = ref([]);

onMounted(() => {
  cities.value = [
    {
      id: 1,
      name: "Annecy",
      lat: 45.8992,
      lon: 6.1294,
      weather: "sun",
    },
    {
      id: 2,
      name: "Lyon",
      lat: 45.764,
      lon: 4.8357,
      weather: "cloud",
    },
  ];
});
</script>

<template>
  <div id="map">
    <l-map
      style="height: 500px; width: 100%"
      :zoom="6"
      :center="[46.5, 2.5]"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      ></l-tile-layer>

      <l-marker
        v-for="city in cities"
        :key="city.id"
        :lat-lng="[city.lat, city.lon]"
      >
      </l-marker>
    </l-map>
  </div>
</template>

<style scoped>
#map {
  width: 100%;
  height: 500px;
  margin: 2rem auto;
  max-width: 1200px;
}
</style>