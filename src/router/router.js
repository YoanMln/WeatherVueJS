import { createRouter, createWebHistory } from "vue-router";

import citiesList from "@/views/citiesList.vue";
import home from "@/views/home.vue";
import city from "@/components/city.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: home,
    },
    {
      path: "/villes",
      name: "citiesList",
      component: citiesList,
    },
    {
      path: "/city",
      name: "Ville",
      component: city,
    },
  ],
});

export default router;
