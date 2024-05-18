import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ThreadsListView from '@/views/ThreadsListView.vue'
import ThreadView from '../views/ThreadView.vue'
import SettingsView from '@/views/SettingsView.vue'
import LoginView from '@/views/LoginView.vue'
import FavouritesView from '@/views/FavouritesView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Home Page'
    }
  },
  {
    path: '/threads/:page',
    name: 'threads',
    component: ThreadsListView,
    props: true,
    meta: {
      title: 'Threads List'
    }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/thread/:t_number',
    name: 'thread',
    component: ThreadView,
    props: true,
    meta: {
      title: 'Thread'
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    props: true,
    meta: {
      title: 'Settings'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    props: true,
    meta: {
      title: 'Login'
    }
  },
  {
    path: '/favourites',
    name: 'favourites',
    component: FavouritesView,
    props: true,
    meta: {
      title: 'Favourites'
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
