// File: frontend/src/router/index.ts
/**
 * @fileoverview Vue Router configuration for the application.
 * Defines all routes, navigation guards (for authentication, authorization, etc.),
 * and scroll behavior. This module is central to the application's navigation structure.
 * @module router/index
 */
import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  NavigationGuardNext,
  RouteLocationNormalized,
  Router,
} from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../features/auth/store/auth.store';
import { seoService } from '../services/seoService';
import { useI18n } from '../composables/useI18n'; // For translated titles
import { AppError } from '../types/api.types'; // Or a more generic AppError from types/index

// --- Route Component Imports ---
// Using dynamic imports (lazy loading) for views to improve initial load time.
const MainLayout = () => import('../components/layout/MainLayout.vue');
const HomeView = () => import('../features/chat/views/HomeView.vue');
const LoginView = () => import('../features/auth/views/LoginView.vue');
const SettingsView = () => import('../features/settings/views/SettingsView.vue');
const AboutView = () => import('../features/about/views/AboutView.vue');
const PublicAgentAccessView = () => import('../features/public_agent_access/views/AgentAccessView.vue');
const NotFoundView = () => import('../components/common/NotFoundView.vue'); // A generic 404 component

/**
 * Defines application routes. Each route can have metadata for:
 * - `requiresAuth`: Boolean, true if the route requires authentication.
 * - `guestOnly`: Boolean, true if the route should only be accessible to unauthenticated users.
 * - `title`: String or Function returning a string, for dynamic document titles.
 * - `navId`: String, a unique identifier for voice navigation targeting.
 * - `permissions`: Array<string>, for role-based or permission-based access control (future).
 * - `layout`: String, identifier for a specific layout component if not using default (future).
 * @type {ReadonlyArray<RouteRecordRaw>}
 */
export const routes: ReadonlyArray<RouteRecordRaw> = [
  {
    path: '/',
    component: MainLayout, // Default layout for authenticated app sections
    redirect: { name: 'Home' }, // Redirect root to Home
    children: [
      {
        path: 'home', // Changed from empty path to be explicit
        name: 'Home',
        component: HomeView,
        meta: {
          requiresAuth: true,
          title: () => useI18n().t('pageTitles.home'), // Example of using i18n for titles
          navId: 'home',
        },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: SettingsView,
        meta: {
          requiresAuth: true,
          title: () => useI18n().t('pageTitles.settings'),
          navId: 'settings',
        },
      },
      {
        path: 'about',
        name: 'About',
        component: AboutView,
        meta: {
          // No auth required for about page
          title: () => useI18n().t('pageTitles.about'),
          navId: 'about',
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      guestOnly: true,
      title: () => useI18n().t('pageTitles.login'),
      navId: 'login',
    },
  },
  {
    path: '/agent-access', // More conventional path for public access
    name: 'AgentAccess',
    component: PublicAgentAccessView,
    meta: {
      title: () => useI18n().t('pageTitles.agentAccess'),
      isPublicPage: true, // Custom flag for identifying this type of page
      navId: 'agent-access',
    },
  },
  // Add other top-level routes like /register, /forgot-password, /pricing if needed
  // {
  //   path: '/register',
  //   name: 'Register',
  //   component: () => import('../features/auth/views/RegisterView.vue'),
  //   meta: { guestOnly: true, title: 'Register', navId: 'register' },
  // },

  // Catch-all 404 Not Found route - must be the last route defined.
  {
    path: '/:pathMatch(.*)*', // Matches everything not matched by previous routes
    name: 'NotFound',
    component: NotFoundView,
    meta: {
      title: () => useI18n().t('pageTitles.notFound'),
    },
  },
];

/**
 * Creates and configures the Vue Router instance.
 * Includes navigation guards for authentication, SEO updates, and scroll behavior.
 * @returns {Router} The configured Vue Router instance.
 */
export function createAppRouter(): Router {
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), // BASE_URL from Vite config
    routes,
    /**
     * Defines scroll behavior for navigations.
     * @param {RouteLocationNormalized} to - The target route.
     * @param {RouteLocationNormalized} from - The source route.
     * @param {Scroll ništa | null} savedPosition - Saved scroll position (if any from browser back/forward).
     * @returns {Promise<ScrollBehaviorPosition | false | void> | ScrollBehaviorPosition | false | void} Scroll position or behavior.
     */
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition; // Restore previous scroll position on back/forward
      } else if (to.hash) {
        // Scroll to anchor if hash is present
        return { el: to.hash, behavior: 'smooth', top: 70 }; // Adjust 'top' offset for fixed headers
      } else {
        // Scroll to top for new navigations
        return { top: 0, behavior: 'smooth' };
      }
    },
  });

  /**
   * Global navigation guard executed before each navigation.
   * Handles authentication checks, redirects, and SEO metadata updates.
   */
  router.beforeEach(async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    // It's crucial that Pinia is initialized before this guard runs.
    // This is usually handled by initializing Pinia before the router in `main.ts`.
    const authStore = useAuthStore();
    const { isAuthenticated } = storeToRefs(authStore); // Get reactive auth state

    // Attempt to initialize/check auth status if not already done (e.g., on page refresh)
    // This might involve checking a persisted token.
    if (!authStore.isInitialized) {
      await authStore.initializeAuth();
    }

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const guestOnly = to.matched.some(record => record.meta.guestOnly);

    // Update document title and other SEO metadata
    if (to.meta.title) {
      const titleValue = typeof to.meta.title === 'function' ? to.meta.title() : to.meta.title;
      seoService.setTitle(String(titleValue));
    } else {
        // Fallback title
        const { t } = useI18n();
        seoService.setTitle(t('app.defaultTitle') || 'AgentOS Platform');
    }
    // Add more seoService calls here for description, canonical, OpenGraph tags based on route meta.
    // e.g., seoService.setMetaTag('description', typeof to.meta.description === 'function' ? to.meta.description() : to.meta.description || '');


    if (requiresAuth && !isAuthenticated.value) {
      // Redirect to login if auth is required but user is not authenticated
      console.debug(`[RouterGuard] Auth required for "${to.path}". User not authenticated. Redirecting to Login.`);
      next({
        name: 'Login',
        query: { redirect: to.fullPath }, // Pass the original intended path for redirection after login
        replace: true, // Avoid adding the original restricted path to history
      });
    } else if (guestOnly && isAuthenticated.value) {
      // Redirect to home if trying to access a guest-only page (like Login) while authenticated
      console.debug(`[RouterGuard] Guest-only route "${to.path}" accessed by authenticated user. Redirecting to Home.`);
      next({ name: 'Home', replace: true });
    } else {
      // All checks passed, allow navigation
      next();
    }
  });

  /**
   * Global navigation error handler.
   * Logs errors that occur during navigation.
   */
  router.onError((error: Error, to: RouteLocationNormalized) => {
    console.error(`[RouterError] Failed to navigate to "${to.fullPath}":`, error.message, error.stack);
    // Potentially redirect to a generic error page or show a notification
    // Example: if (error.name === 'ChunkLoadError') { router.push('/network-error'); }
  });

  return router;
}