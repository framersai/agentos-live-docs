// File: frontend/src/router/index.ts
/**
 * @file router/index.ts
 * @description Vue Router configuration for the application.
 * Manages all frontend routes, navigation guards for authentication,
 * and scroll behavior.
 */
import {
    createRouter,
    createWebHistory,
    RouteLocationNormalized,
    NavigationGuardNext,
    RouteRecordRaw
} from 'vue-router';

// Import Views
// It's good practice to use defineAsyncComponent for route components for lazy loading
import { defineAsyncComponent } from 'vue';

const Login = defineAsyncComponent(() => import('@/views/Login.vue'));
const Settings = defineAsyncComponent(() => import('@/views/Settings.vue'));
const About = defineAsyncComponent(() => import('@/views/About.vue'));
const PublicHome = defineAsyncComponent(() => import('@/views/PublicHome.vue'));
const PrivateHome = defineAsyncComponent(() => import('@/views/PrivateHome.vue'));
const NotFound = defineAsyncComponent(() => import('@/views/NotFound.vue')); // Create this component

/**
 * Key used for storing the authentication token in localStorage/sessionStorage.
 */
export const AUTH_TOKEN_KEY: string = 'vcaAuthToken';

/**
 * Checks if the user is authenticated by looking for the auth token.
 * @returns {boolean} True if authenticated, false otherwise.
 */
const isAuthenticated = (): boolean => {
    if (typeof window !== 'undefined') { // Ensure localStorage is available (client-side)
        return !!(localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY));
    }
    return false;
};

// Define Routes
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Root',
        redirect: () => (isAuthenticated() ? { name: 'PrivateHome' } : { name: 'PublicHome' }),
    },
    {
        path: '/public',
        name: 'PublicHome',
        component: PublicHome,
        meta: { title: 'Welcome - Voice Chat Assistant' }
    },
    {
        path: '/app', // Main path for authenticated users
        name: 'PrivateHome',
        component: PrivateHome,
        meta: { requiresAuth: true, title: 'My Assistant Dashboard' }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { guest: true, title: 'Login - Voice Chat Assistant' }
    },
    {
        path: '/settings',
        name: 'Settings',
        component: Settings,
        meta: { requiresAuth: true, title: 'Settings - Voice Chat Assistant' }
    },
    {
        path: '/about',
        name: 'About',
        component: About,
        meta: { requiresAuth: false, title: 'About - Voice Chat Assistant' }
    },
    {
        path: '/:pathMatch(.*)*', // Catch-all for 404
        name: 'NotFound',
        component: NotFound,
        meta: { title: 'Page Not Found' }
    }
];

// Create Router Instance
const router = createRouter({
    // @ts-ignore
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0, behavior: 'smooth' };
        }
    }
});

// Navigation Guard
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isGuestRoute = to.matched.some(record => record.meta.guest);
    const authenticated = isAuthenticated();

    // Update document title
    if (to.meta.title && typeof to.meta.title === 'string') {
        document.title = to.meta.title;
    } else {
        document.title = 'Voice Chat Assistant'; // Default title
    }

    if (requiresAuth && !authenticated) {
        console.log('[Router] Guard: Auth required, user not authenticated. Redirecting to Login.');
        next({ name: 'Login', query: { redirect: to.fullPath } });
    } else if (isGuestRoute && authenticated && to.name === 'Login') {
        console.log('[Router] Guard: Login route, user IS authenticated. Redirecting to PrivateHome.');
        next({ name: 'PrivateHome' });
    } else {
        next(); // Proceed as normal
    }
});

export default router;