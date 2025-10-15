// File: frontend/src/router/index.ts
/**
 * @file router/index.ts
 * @description Vue Router configuration for the application.
 * Manages all frontend routes, navigation guards for authentication,
 * and scroll behavior.
 * v2.0.1: Updated async component import syntax.
 */
import {
    createRouter,
    createWebHistory,
    RouteLocationNormalized,
    NavigationGuardNext,
    RouteRecordRaw
} from 'vue-router';
import { h } from 'vue';
import { RouterView } from 'vue-router';
import { AVAILABLE_LOCALES, getCurrentLocale, setLocale, type AvailableLocale } from '@/i18n';
import i18n from '@/i18n';

// Import Views using modern shorthand for lazy loading
const Login = () => import('@/views/Login.vue');
const Settings = () => import('@/views/settings/Settings.vue');
const AcceptInvite = () => import('@/views/AcceptInvite.vue');
const About = () => import('@/views/About.vue');
const PublicHome = () => import('@/views/PublicHome.vue');
const PrivateHome = () => import('@/views/PrivateHome.vue');
const NotFound = () => import('@/views/NotFound.vue');

// AUTH_TOKEN_KEY, isAuthenticated, routes, router creation, and beforeEach guard remain the same.
// No changes needed for the logic, only the import style was for defineAsyncComponent.

export const AUTH_TOKEN_KEY: string = 'vcaAuthToken';

const isAuthenticated = (): boolean => {
    if (typeof window !== 'undefined') { 
        return !!(localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY));
    }
    return false;
};

const supportedLocales = Object.keys(AVAILABLE_LOCALES);

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: () => {
            const locale = getCurrentLocale();
            return `/${locale}/`;
        }
    },
    // Redirect common paths without locale to locale-prefixed versions
    {
        path: '/about',
        redirect: () => `/${getCurrentLocale()}/about`
    },
    {
        path: '/login',
        redirect: () => `/${getCurrentLocale()}/login`
    },
    {
        path: '/settings',
        redirect: () => `/${getCurrentLocale()}/settings`
    },
    {
        path: '/pro',
        redirect: () => `/${getCurrentLocale()}/pro`
    },
    {
        path: '/:locale',
        component: {
            render: () => h(RouterView)
        },
        beforeEnter(to, from, next) {
            const locale = to.params.locale as string;
            console.log('[Router] Locale route beforeEnter. Locale param:', locale);
            console.log('[Router] Supported locales:', supportedLocales);

            if (supportedLocales.includes(locale)) {
                console.log('[Router] Valid locale detected. Setting locale:', locale);
                setLocale(locale as AvailableLocale);
                i18n.global.locale.value = locale as AvailableLocale;
                console.log('[Router] i18n global locale after set:', i18n.global.locale.value);
                next();
            } else {
                console.log('[Router] Invalid locale. Redirecting with default:', getCurrentLocale());
                next(`/${getCurrentLocale()}${to.path.substring(locale.length + 1)}`);
            }
        },
        children: [
            {
                path: '',
                name: 'PublicHome',
                component: PublicHome,
                meta: { guest: true, title: 'Welcome - Voice Chat Assistant' }
            },
            {
                path: 'pro',
                name: 'AuthenticatedHome',
                component: PrivateHome,
                meta: { requiresAuth: true, title: 'Pro - Voice Chat Assistant' }
            },
            {
                path: 'login',
                name: 'Login',
                component: Login,
                meta: { guest: true, title: 'Login - Voice Chat Assistant' }
            },
            {
                path: 'settings',
                name: 'Settings',
                component: Settings,
                meta: { requiresAuth: true, title: 'Settings - Voice Chat Assistant' }
            },
            {
                path: 'invite/:token',
                name: 'AcceptInvite',
                component: AcceptInvite,
                meta: { requiresAuth: true, title: 'Team Invite - Voice Chat Assistant' }
            },
            {
                path: 'about',
                name: 'About',
                component: About,
                meta: { title: 'About - Voice Chat Assistant' }
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
        meta: { title: 'Page Not Found' }
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) return savedPosition;
        return { top: 0, behavior: 'smooth' };
    }
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authenticated = isAuthenticated();
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isGuestOnlyRoute = to.matched.some(record => record.meta.guest);

    // Set page title
    if (to.meta.title && typeof to.meta.title === 'string') {
        document.title = to.meta.title;
    } else {
        document.title = 'Voice Chat Assistant';
    }

    // Extract locale from route and ensure it's set
    const locale = to.params.locale as string;
    if (locale && locale !== i18n.global.locale.value) {
        console.log('[Router] beforeEach: Syncing locale from route:', locale);
        setLocale(locale as AvailableLocale);
        i18n.global.locale.value = locale as AvailableLocale;
    }

    if (requiresAuth && !authenticated) {
        console.log('[Router] Guard: Authentication required. Redirecting to Login.');
        next({ name: 'Login', params: { locale: locale || getCurrentLocale() }, query: { redirect: to.fullPath } });
    } else if (isGuestOnlyRoute && authenticated) {
        console.log('[Router] Guard: Guest route accessed by authenticated user. Redirecting to AuthenticatedHome.');
        next({ name: 'AuthenticatedHome', params: { locale: locale || getCurrentLocale() } });
    } else {
        next();
    }
});

export default router;
