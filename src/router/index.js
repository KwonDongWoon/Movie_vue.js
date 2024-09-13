import { createRouter, createWebHistory } from 'vue-router'
import MovieList from '../views/MovieList.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: MovieList
  },
  {
    path: '/movie',
    name: 'movie',
    component: () => import(/* webpackChunkName: "movie" */ '../views/MovieList.vue')
  },
  {
    path: '/movie/:movieCd',
    name: 'MovieDetail',
    component: () => import(/* webpackChunkName: "MovieDetail" */ '../components/MovieDetail.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router
