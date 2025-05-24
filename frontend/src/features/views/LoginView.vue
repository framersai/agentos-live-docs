// File: frontend/src/features/auth/views/LoginView.vue
<template>
  <div class="login-view-page" :data-voice-target-region="'login-page'">
    <div class="login-view-container">
      <div class="text-center">
        <div class="logo-wrapper">
          <img
            class="logo-image"
            src="@/assets/logo.svg"
            :alt="t('app.name') + ' Logo'"
            :data-voice-target="voiceTargetIdPrefix + 'app-logo'"
          />
        </div>
        <h1 class="app-title" :data-voice-target="voiceTargetIdPrefix + 'app-title'">
          <span class="title-gradient">{{ t('app.namePart1') }}</span> {{ t('app.namePart2') }}
        </h1>
        <p class="app-tagline" :data-voice-target="voiceTargetIdPrefix + 'app-tagline'">
          {{ t('app.tagline') }}
        </p>
      </div>

      <AppCard
        variant="elevated"
        padding="lg"
        class="login-form-card"
        :voice-target="voiceTargetIdPrefix + 'login-card'"
        :voice-target-id-prefix="voiceTargetIdPrefix + 'login-card-'"
      >
        <template #header>
          <h2 class="text-xl font-semibold card-title" :data-voice-target="voiceTargetIdPrefix + 'form-title'">
            {{ isRegisterMode ? t('auth.registerTitle') : t('auth.loginTitle') }}
          </h2>
        </template>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <AppInput
            v-if="isRegisterMode"
            v-model="formData.username"
            :label="t('forms.usernameLabel')"
            name="username"
            type="text"
            autocomplete="username"
            :required="isRegisterMode"
            :error-message="authStore.authError && authStore.authError.details?.username ? authStore.authError.details.username : ''"
            :voice-target="voiceTargetIdPrefix + 'username-input'"
            :placeholder="t('forms.usernamePlaceholder')"
            floatingLabel
          />
          <AppInput
            v-model="formData.email"
            :label="t('forms.emailLabel')"
            name="email"
            type="email"
            autocomplete="email"
            required
            :error-message="authStore.authError && authStore.authError.details?.email ? authStore.authError.details.email : ''"
            :voice-target="voiceTargetIdPrefix + 'email-input'"
            :placeholder="t('forms.emailPlaceholder')"
            floatingLabel
          />
          <AppInput
            v-model="formData.password"
            :label="t('forms.passwordLabel')"
            name="password"
            type="password"
            :autocomplete="isRegisterMode ? 'new-password' : 'current-password'"
            required
            :error-message="authStore.authError && authStore.authError.details?.password ? authStore.authError.details.password : ''"
            :voice-target="voiceTargetIdPrefix + 'password-input'"
            :placeholder="t('forms.passwordPlaceholder')"
            floatingLabel
          />
          <AppInput
            v-if="isRegisterMode"
            v-model="formData.confirmPassword"
            :label="t('forms.confirmPasswordLabel')"
            name="confirmPassword"
            type="password"
            autocomplete="new-password"
            :required="isRegisterMode"
            :error-message="authStore.authError && authStore.authError.details?.confirmPassword ? authStore.authError.details.confirmPassword : ''"
            :voice-target="voiceTargetIdPrefix + 'confirm-password-input'"
            :placeholder="t('forms.confirmPasswordPlaceholder')"
            floatingLabel
          />

          <div v-if="!isRegisterMode" class="flex items-center justify-between">
            <AppToggleSwitch
              v-model="rememberMe"
              :label="t('auth.rememberMe')"
              :id="voiceTargetIdPrefix + 'remember-me-toggle'"
              :voice-target="voiceTargetIdPrefix + 'remember-me-switch'"
              size="sm"
              showLabel
            />
            <AppButton
              variant="link"
              size="sm"
              :label="t('auth.forgotPasswordLink')"
              :data-voice-target="voiceTargetIdPrefix + 'forgot-password-link'"
              @click="handleForgotPassword"
            />
          </div>

          <AppButton
            type="submit"
            variant="primary"
            size="lg"
            block
            :loading="authStore.isLoading"
            :disabled="authStore.isLoading"
            :label="isRegisterMode ? t('auth.registerButton') : t('auth.loginButton')"
            :voice-target="voiceTargetIdPrefix + (isRegisterMode ? 'register-submit-button' : 'login-submit-button')"
          />

          <p v-if="authStore.authError && !authStore.authError.details" class="text-danger-500 text-sm text-center">
            {{ authStore.authError.message }}
          </p>
        </form>

        <template #footer>
          <div class="text-center pt-4">
            <AppButton variant="link" size="sm" @click="toggleMode" :data-voice-target="voiceTargetIdPrefix + 'toggle-auth-mode-link'">
              {{ isRegisterMode ? t('auth.alreadyHaveAccount') : t('auth.dontHaveAccount') }}
            </AppButton>
          </div>
        </template>
      </AppCard>

      <div class="text-center mt-8">
         <AppButton
            variant="tertiary"
            size="sm"
            :pill="true"
            :icon="uiStore.currentTheme === AppTheme.DARK || uiStore.currentTheme === AppTheme.HOLOGRAPHIC ? SunIcon : MoonIcon"
            :aria-label="t('header.toggleTheme')" :title="t('header.toggleTheme')"
            :data-voice-target="voiceTargetIdPrefix + 'theme-button'"
            @click="handleToggleTheme"
            class="theme-toggle-button"
        />
        <p class="app-footer-text">
          &copy; {{ new Date().getFullYear() }}
          <a :href="appConfig.companyWebsiteUrl" target="_blank" rel="noopener" class="footer-link">
            {{ t('app.companyName') }}
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file LoginView.vue
 * @description User authentication (login and registration) view.
 * Uses Pinia for auth state, AppInput, AppButton, AppToggleSwitch for form elements.
 * Features robust validation feedback, loading states, and is themeable & voice-navigable.
 */
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore, RegistrationData, LoginCredentials } from './store/auth.store';
import { useUiStore } from '../../../store/ui.store';
import { useI18n } from '../../../composables/useI18n';
import { appConfig } from '../../../config/appConfig'; // For footer link
import AppInput from '../../../components/common/AppInput.vue';
import AppButton from '../../../components/common/AppButton.vue';
import AppToggleSwitch from '../../../components/common/AppToggleSwitch.vue';
import AppCard from '../../../components/common/AppCard.vue';
import { SunIcon, MoonIcon } from '@heroicons/vue/24/solid';
import { AppTheme } from '../../../types/ui.types';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const uiStore = useUiStore();
const { t } = useI18n();

const voiceTargetIdPrefix = 'login-view-';

const isRegisterMode = ref(false); // Determines if the form is for login or registration
const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
});
const rememberMe = ref(false);

/** Toggles between login and registration mode. */
const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value;
  authStore.setAuthError(null); // Clear previous errors
  // Reset form fields if desired, or keep them for user convenience
  // formData.username = ''; formData.email = ''; formData.password = ''; formData.confirmPassword = '';
};

/** Handles the form submission for both login and registration. */
const handleSubmit = async () => {
  authStore.setAuthError(null); // Clear previous errors

  if (isRegisterMode.value) {
    if (formData.password !== formData.confirmPassword) {
      authStore.setAuthError({ code: 'VALIDATION_ERROR', message: t('auth.errors.passwordsDoNotMatch'), details: { confirmPassword: t('auth.errors.passwordsDoNotMatch') }});
      return;
    }
    const regData: RegistrationData = {
      username: formData.username,
      email: formData.email,
      passwordPlainText: formData.password,
    };
    try {
      await authStore.register(regData);
      // Navigation is handled within authStore.register on success
    } catch (error) {
      // Error is set in authStore, UI will react
      console.warn('[LoginView] Registration error caught in view:', error);
    }
  } else {
    const creds: LoginCredentials = {
      email: formData.email,
      passwordPlainText: formData.password,
    };
    try {
      await authStore.login(creds, rememberMe.value);
      // Navigation is handled within authStore.login on success
    } catch (error) {
      console.warn('[LoginView] Login error caught in view:', error);
    }
  }
};

/** Placeholder for forgot password functionality. */
const handleForgotPassword = () => {
  uiStore.addNotification({ type: 'info', title: t('auth.forgotPassword'), message: t('auth.forgotPasswordNotImplemented') });
  // router.push({ name: 'ForgotPassword' }); // If ForgotPassword view exists
};

const handleToggleTheme = () => {
  let nextTheme: AppTheme;
  if (uiStore.currentTheme === AppTheme.LIGHT) nextTheme = AppTheme.DARK;
  else if (uiStore.currentTheme === AppTheme.DARK) nextTheme = AppTheme.HOLOGRAPHIC;
  else nextTheme = AppTheme.LIGHT;
  uiStore.setTheme(nextTheme);
};

onMounted(() => {
  // If user is already authenticated, redirect away from login page
  if (authStore.isAuthenticated) {
    router.replace(route.query.redirect as string || { name: 'Home' });
  }
  // Check if redirected from a logout or session expiry
  if (route.query.loggedOut || route.query.sessionExpired) {
    uiStore.addNotification({type: 'info', message: t('auth.sessionExpiredOrLoggedOut'), duration: 4000});
    // Clean up query params after showing message so it doesn't reappear on refresh
    router.replace({ query: {} });
  }
});
</script>

<style scoped>
.login-view-page {
  background-image: var(--app-auth-page-bg-gradient,
    radial-gradient(circle at 70% 30%, var(--app-gradient-color-1-light, rgba(var(--app-primary-rgb), 0.05)) 0%, transparent 60%),
    radial-gradient(circle at 30% 70%, var(--app-gradient-color-2-light, rgba(var(--app-accent-rgb), 0.05)) 0%, transparent 60%)
  );
  background-color: var(--app-auth-page-bg-color, var(--app-bg-alt-color)); /* Fallback solid color */
  transition: background-image 0.5s ease-in-out;
}
.theme-dark .login-view-page, .theme-holographic .login-view-page {
  background-image: var(--app-auth-page-bg-gradient-dark,
    radial-gradient(circle at 70% 30%, var(--app-gradient-color-1-dark, rgba(var(--app-primary-rgb), 0.1)) 0%, transparent 60%),
    radial-gradient(circle at 30% 70%, var(--app-gradient-color-2-dark, rgba(var(--app-accent-rgb), 0.1)) 0%, transparent 60%)
  );
}
.theme-holographic .login-view-page {
    background-image: var(--holographic-auth-bg-gradient); /* Defined in holographic theme CSS */
}


.login-view-container {
  width: 100%;
  max-width: var(--auth-form-max-width, 28rem); /* Tailwind max-w-md */
  margin: 0 auto;
}

.logo-wrapper {
  margin: 0 auto 1.5rem auto; /* mb-6 */
  height: 6rem; /* h-24 */
  width: 6rem; /* w-24 */
  border-radius: var(--app-border-radius-full);
  box-shadow: var(--app-shadow-xl);
  background-color: var(--app-surface-color);
  padding: 0.25rem; /* p-1 */
  /* Ring effect using box-shadow for better control with variables */
  box-shadow: 0 0 0 2px var(--app-primary-border-subtle, rgba(var(--app-primary-rgb), 0.2)),
              var(--app-shadow-xl);
  transition: transform 0.3s ease-out;
}
.logo-wrapper:hover {
    transform: scale(1.05);
}
.logo-image {
  height: 100%;
  width: 100%;
  object-fit: contain;
}

.app-title {
  margin-top: 1.5rem; /* mt-6 */
  font-size: var(--app-font-size-3xl, 1.875rem); /* text-3xl */
  font-weight: var(--app-font-weight-extrabold, 800);
  letter-spacing: -0.025em; /* tracking-tight */
  color: var(--app-heading-color);
}
.title-gradient {
  background-image: var(--app-title-gradient, linear-gradient(to right, var(--app-primary-color), var(--app-accent-color)));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.app-tagline {
  margin-top: 0.5rem; /* mt-2 */
  font-size: var(--app-font-size-sm);
  color: var(--app-text-secondary-color);
}

.login-form-card {
  margin-top: 2rem; /* space-y-8 from parent */
  /* AppCard handles its own styling including theme adjustments */
  /* Can add specific overrides if needed */
}
.login-form-card .card-title { /* Target title within card */
    color: var(--app-card-title-color);
    text-align: center;
    width: 100%;
}

.app-footer-text {
  font-size: var(--app-font-size-xs);
  color: var(--app-text-muted-color);
}
.footer-link {
  color: var(--app-primary-color);
  transition: color 0.2s ease;
}
.footer-link:hover {
  color: var(--app-primary-color-dark); /* Darker shade on hover */
}
.theme-toggle-button {
    /* Example for the theme toggle if it's outside AppButton standard styling */
    background-color: var(--app-surface-raised-color);
    color: var(--app-text-secondary-color);
    border: 1px solid var(--app-border-color);
}
.theme-toggle-button:hover {
    background-color: var(--app-surface-hover-color);
}
</style>