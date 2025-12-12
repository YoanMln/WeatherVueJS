<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <div class="app">
     
    <nav>
      <router-link to="/">Accueil</router-link>
      <router-link to="/villes">Liste des Villes</router-link>
      <router-link to="/ville">Ville</router-link>
    </nav>

    <RouterView></RouterView>
  </div>
</template>

<style scoped lang="scss">
.title {
  text-align: center;
}
nav {
  display: flex;
  justify-content: space-around;
  margin-top: 3rem;
}
</style>
