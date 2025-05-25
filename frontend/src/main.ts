// File: frontend/src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {
  createRouter,
  createWebHistory,
  RouteLocationNormalized,
  NavigationGuardNext,
  RouteRecordRaw // Ensure RouteRecordRaw is imported if not already
} from 'vue-router'
import App from './App.vue'
import './assets/main.css' // Your global styles
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Settings from './views/Settings.vue'
import About from './views/About.vue'

// It's good practice to define the token key as a constant
const AUTH_TOKEN_KEY = 'vcaAuthToken';

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
      meta: { guest: true } // Routes accessible only to unauthenticated users
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
    // Define other routes here
  ]
})

// Navigation guard
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  // Use the consistent token key
  const token = localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
  const isAuthenticated = token !== null;

  if (to.matched.some((record: RouteRecordRaw) => record.meta?.requiresAuth)) {
    if (!isAuthenticated) {
      console.log('NavGuard: Route requires auth, user not authenticated. Redirecting to login.');
      next({ path: '/login', query: { redirect: to.fullPath } }); // Optionally pass redirect query
    } else {
      next();
    }
  } else if (to.matched.some((record: RouteRecordRaw) => record.meta?.guest)) {
    if (isAuthenticated) {
      console.log('NavGuard: Guest route, user IS authenticated. Redirecting to home.');
      next('/'); // Redirect authenticated users away from guest pages like login
    } else {
      next();
    }
  } else {
    next(); // Always call next()
  }
});

// Create app
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')