import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Weather from '../views/Weather.vue'
import DataAnalysis from '../views/DataAnalysis.vue'
import About from '../views/About.vue'
import WeatherMap from '../views/WeatherMap.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/weather',
    name: 'Weather',
    component: Weather
  },
  {
    path: '/analysis',
    name: 'DataAnalysis',
    component: DataAnalysis
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/map',
    name: 'WeatherMap',
    component: WeatherMap
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 