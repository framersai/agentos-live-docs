// File: frontend/src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { 
  createRouter, 
  createWebHistory,
  RouteLocationNormalized,
  NavigationGuardNext,
  RouteRecordRaw
} from 'vue-router'
import App from './App.vue'
import './assets/main.css'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Settings from './views/Settings.vue'
import About from './views/About.vue'

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      component: Login,
      meta: { guest: true }
    },
    {
      path: '/settings',
      component: Settings,
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      component: About,
      meta: { requiresAuth: false } // About page accessible to all
    }
  ]
})

// Navigation guard
router.beforeEach((to: RouteLocationNormalized, _: RouteLocationNormalized, next: NavigationGuardNext) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  const isAuthenticated = token !== null
  
  if (to.matched.some((record: RouteRecordRaw) => record.meta?.requiresAuth)) {
    if (!isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  } else if (to.matched.some((record: RouteRecordRaw) => record.meta?.guest)) {
    if (isAuthenticated) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

// Create app
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')