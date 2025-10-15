// File: frontend/src/views/Login.vue
/**
* @file Login.vue
* @description Refined login page for the Voice Chat Assistant with a single-column layout and Supabase-aware auth tabs.
*/
<script setup lang="ts">
import { ref, onMounted, computed, inject, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStorage } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { authAPI } from '@/utils/api';
import { LockClosedIcon, EyeIcon, EyeSlashIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import type { ToastService } from '@/services/services';
import logoSvg from '@/assets/logo.svg';
import { useAuth } from '@/composables/useAuth';
import type { Provider } from '@supabase/supabase-js';
import PlanComparisonModal from '@/components/plan/PlanComparisonModal.vue';
import { usePlans } from '@/composables/usePlans';

type LoginTab = 'global' | 'supabase';

const router = useRouter();
const route = useRoute();
const toast = inject<ToastService>('toast');
const { t } = useI18n();
const { findPlan } = usePlans();
const auth = useAuth();
const basicPlan = computed(() => findPlan('basic'));
const creatorPlan = computed(() => findPlan('creator'));
const organizationPlan = computed(() => findPlan('organization'));
const startingPrice = computed(() => {
  const price = basicPlan.value?.monthlyPriceUsd;
  if (typeof price === 'number' && !Number.isNaN(price)) {
    return `$${price.toFixed(0)}`;
  }
  return '$9';
});
const showPlanModal = ref(false);

const openPlanModal = () => { showPlanModal.value = true; };
const closePlanModal = () => { showPlanModal.value = false; };

const supabaseEnabled = computed(() => auth.supabaseEnabled);
const activeTab = ref<LoginTab>(supabaseEnabled.value ? 'supabase' : 'global');

const globalPassword = ref('');
const globalRememberMe = useStorage('vca-rememberGlobalLogin', false);
const showGlobalPassword = ref(false);
const globalIsLoggingIn = ref(false);
const globalErrorMessage = ref('');

const standardEmail = ref('');
const standardPassword = ref('');
const standardRememberMe = useStorage('vca-rememberStandardLogin', true);
const showStandardPassword = ref(false);
const standardIsLoggingIn = ref(false);
const standardErrorMessage = ref('');

const oauthInFlight = ref(false);
const oauthProviders: Array<{ id: Provider; label: string }> = [
  { id: 'google', label: 'Continue with Google' },
  { id: 'github', label: 'Continue with GitHub' },
];

const selectTab = (tab: LoginTab) => {
  if (tab === 'supabase' && !supabaseEnabled.value) {
    return;
  }
  activeTab.value = tab;
  globalErrorMessage.value = '';
  standardErrorMessage.value = '';
};

watch(supabaseEnabled, (enabled) => {
  if (!enabled && activeTab.value !== 'global') {
    activeTab.value = 'global';
  }
});

const handleSupabaseOAuth = async (provider: Provider) => {
  if (!supabaseEnabled.value) {
    toast?.add({ type: 'error', title: t('errors.general'), message: 'Supabase authentication is not configured.' });
    return;
  }
  try {
    oauthInFlight.value = true;
    await auth.loginWithOAuth(provider, window.location.origin + window.location.pathname);
    toast?.add({ type: 'info', title: 'Redirecting', message: 'Complete the sign-in flow in the opened tab.' });
  } catch (error: any) {
    console.error('[Login.vue] Supabase OAuth error:', error);
    const message = error?.message || 'Unable to start Supabase authentication.';
    toast?.add({ type: 'error', title: t('errors.general'), message });
  } finally {
    oauthInFlight.value = false;
  }
};

const redirectAfterLogin = async (): Promise<void> => {
  toast?.add({ type: 'success', title: t('auth.loginSuccess'), message: t('common.welcome') });
  const redirectPath = route.query.redirect as string | undefined;
  if (redirectPath && redirectPath !== '/' && redirectPath !== '/login') {
    await router.replace(redirectPath);
  } else {
    await router.replace({ name: 'AuthenticatedHome' });
  }
};

const handleGlobalLogin = async () => {
  if (!globalPassword.value) {
    globalErrorMessage.value = t('auth.globalPasswordRequired', 'Global password is required');
    return;
  }
  globalIsLoggingIn.value = true;
  globalErrorMessage.value = '';
  try {
    const { data } = await authAPI.loginGlobal({
      password: globalPassword.value,
      rememberMe: globalRememberMe.value,
    });
    if (data?.token) {
      auth.login(data.token, globalRememberMe.value, data.user);
      if (!data?.user) {
        await auth.refreshUser();
      }
      await redirectAfterLogin();
    } else {
      throw new Error('NO_TOKEN');
    }
  } catch (error: any) {
    console.error('[Login.vue] Global login failed', error?.response || error);
    const message = error?.response?.data?.message || error?.message || 'Global access denied.';
    globalErrorMessage.value = message;
    toast?.add({ type: 'error', title: t('errors.general'), message });
  } finally {
    globalIsLoggingIn.value = false;
  }
};

const handleStandardLogin = async () => {
  if (!standardEmail.value || !standardPassword.value) {
    standardErrorMessage.value = t('auth.missingCredentials', 'Email and password are required');
    return;
  }
  standardIsLoggingIn.value = true;
  standardErrorMessage.value = '';
  try {
    if (supabaseEnabled.value && auth.supabaseClient) {
      await auth.loginWithSupabasePassword(standardEmail.value, standardPassword.value);
      await redirectAfterLogin();
    } else {
      const { data } = await authAPI.loginStandard({
        email: standardEmail.value,
        password: standardPassword.value,
        rememberMe: standardRememberMe.value,
      });
      if (data?.token) {
        auth.login(data.token, standardRememberMe.value, data.user);
        if (!data?.user) {
          await auth.refreshUser();
        }
        await redirectAfterLogin();
      } else {
        throw new Error('NO_TOKEN');
      }
    }
  } catch (error: any) {
    console.error('[Login.vue] Standard login failed', error?.response || error);
    const message = error?.response?.data?.message || error?.message || t('auth.loginError');
    standardErrorMessage.value = message;
    toast?.add({ type: 'error', title: t('errors.general'), message });
  } finally {
    standardIsLoggingIn.value = false;
  }
};

onMounted(async () => {
  const authed = auth.checkAuthStatus();
  if (authed) {
    console.log('[Login.vue] User already has a token, attempting redirect.');
    await auth.refreshUser();
    await router.replace({ name: 'AuthenticatedHome' });
    return;
  }

  if (route.query.sessionExpired === 'true') {
    let reasonMessage = 'Your session has expired. Please log in again.';
    if (route.query.reason === 'unauthorized') {
      reasonMessage = 'Your session was invalid or unauthorized. Please log in again.';
    }
    toast?.add({ type: 'warning', title: 'Session Expired', message: reasonMessage, duration: 7000 });
    await router.replace({ query: {} });
  }
});
</script>

<template>
  <div class="login-page">
    <div class="login-shell">
      <section class="login-hero">
        <div class="hero-logo">
          <img :src="logoSvg" alt="Voice Chat Assistant logo" />
        </div>
        <h1 class="hero-title">
          {{ $t('common.welcome') }} — Voice-first workflows for builders
        </h1>
        <p class="hero-subtitle">
          Speak, iterate, and ship faster with contextual personas, live code snippets, and diagram-aware responses.
        </p>
        <ul class="hero-highlights">
          <li>Realtime transcription with adaptive memory</li>
          <li>Persona toolkits for coding, systems, and meetings</li>
          <li>Choose a shared passphrase or personal Supabase account</li>
        </ul>
        <div class="hero-actions">
          <button type="button" class="hero-plan-button" @click="openPlanModal">
            {{ $t('auth.comparePlans', 'Compare plans & pricing') }}
          </button>
          <p class="hero-note">
            {{ $t('auth.planStartingPrice', 'Plans start at') }}
            <strong>{{ startingPrice }}</strong>
            / {{ $t('auth.perMonth', 'month') }}
          </p>
        </div>
      </section>

      <section class="login-panel glass-pane">
        <header class="panel-header">
          <div class="panel-icon">
            <LockClosedIcon aria-hidden="true" />
          </div>
          <div>
            <h2 class="panel-title">{{ $t('auth.signInTitle', 'Access your workspace') }}</h2>
            <p class="panel-subtitle">
              {{ $t('auth.signInSubtitle', 'Pick the passphrase or personal account that matches your team setup.') }}
            </p>
          </div>
        </header>

        <div v-if="supabaseEnabled" class="panel-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            :aria-selected="activeTab === 'global'"
            :class="['panel-tab', { active: activeTab === 'global' }]"
            @click="selectTab('global')"
          >
            {{ $t('auth.globalAccessTitle', 'Global Passphrase') }}
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="activeTab === 'supabase'"
            :class="['panel-tab', { active: activeTab === 'supabase' }]"
            @click="selectTab('supabase')"
          >
            {{ $t('auth.supabaseAccessTitle', 'Supabase Account') }}
          </button>
        </div>

        <Transition name="login-fade" mode="out-in">
          <form
            v-if="activeTab === 'global'"
            key="global"
            class="panel-form"
            @submit.prevent="handleGlobalLogin"
          >
            <div class="input-group">
              <label for="global-password">
                {{ $t('auth.globalPasswordLabel', 'Operations passphrase') }}
              </label>
              <div class="input-with-toggle">
                <input
                  id="global-password"
                  v-model="globalPassword"
                  :type="showGlobalPassword ? 'text' : 'password'"
                  :placeholder="$t('auth.globalPasswordPlaceholder', 'Enter the shared passphrase')"
                  autocomplete="off"
                  required
                />
                <button
                  type="button"
                  class="toggle-visibility"
                  :aria-label="showGlobalPassword ? 'Hide passphrase' : 'Show passphrase'"
                  @click="showGlobalPassword = !showGlobalPassword"
                >
                  <component :is="showGlobalPassword ? EyeSlashIcon : EyeIcon" aria-hidden="true" />
                </button>
              </div>
            </div>

            <label class="remember-toggle">
              <input type="checkbox" v-model="globalRememberMe" />
              <span>{{ $t('auth.rememberGlobal', 'Remember this device') }}</span>
            </label>

            <button type="submit" class="primary-button" :disabled="globalIsLoggingIn">
              <span v-if="globalIsLoggingIn" class="button-spinner" aria-hidden="true"></span>
              <span v-else>{{ $t('auth.globalLoginButton', 'Unlock operations access') }}</span>
            </button>

            <div v-if="globalErrorMessage" class="error-card" role="alert">
              <ExclamationTriangleIcon class="error-icon" aria-hidden="true" />
              <p>{{ globalErrorMessage }}</p>
            </div>
          </form>

          <div v-else key="supabase" class="panel-form">
            <form class="stacked-form" @submit.prevent="handleStandardLogin">
              <div class="input-group">
                <label for="standard-email">
                  {{ $t('auth.emailLabel', 'Email address') }}
                </label>
                <input
                  id="standard-email"
                  v-model="standardEmail"
                  type="email"
                  autocomplete="email"
                  required
                  :placeholder="$t('auth.emailPlaceholder', 'you@example.com')"
                />
              </div>

              <div class="input-group">
                <label for="standard-password">
                  {{ $t('auth.passwordLabel', 'Password') }}
                </label>
                <div class="input-with-toggle">
                  <input
                    id="standard-password"
                    v-model="standardPassword"
                    :type="showStandardPassword ? 'text' : 'password'"
                    autocomplete="current-password"
                    required
                    :placeholder="$t('auth.passwordPlaceholder', 'Enter your password')"
                  />
                  <button
                    type="button"
                    class="toggle-visibility"
                    :aria-label="showStandardPassword ? 'Hide password' : 'Show password'"
                    @click="showStandardPassword = !showStandardPassword"
                  >
                    <component :is="showStandardPassword ? EyeSlashIcon : EyeIcon" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div class="form-footer">
                <label class="remember-toggle">
                  <input type="checkbox" v-model="standardRememberMe" />
                  <span>{{ $t('auth.rememberStandard', 'Stay signed in on this device') }}</span>
                </label>
                <button type="submit" class="primary-button" :disabled="standardIsLoggingIn">
                  <span v-if="standardIsLoggingIn" class="button-spinner" aria-hidden="true"></span>
                  <span v-else>{{ $t('auth.standardLoginButton', 'Continue with email') }}</span>
                </button>
              </div>

              <div v-if="standardErrorMessage" class="error-card" role="alert">
                <ExclamationTriangleIcon class="error-icon" aria-hidden="true" />
                <p>{{ standardErrorMessage }}</p>
              </div>
            </form>

            <div v-if="supabaseEnabled" class="oauth-section">
              <span class="oauth-label">{{ $t('auth.orContinueWith', 'Or continue with') }}</span>
              <div class="oauth-buttons">
                <button
                  v-for="provider in oauthProviders"
                  :key="provider.id"
                  type="button"
                  class="oauth-button"
                  :disabled="oauthInFlight"
                  @click="handleSupabaseOAuth(provider.id)"
                >
                  <span v-if="oauthInFlight" class="button-spinner" aria-hidden="true"></span>
                  <span v-else>{{ provider.label }}</span>
                </button>
              </div>
            </div>
          </div>
        </Transition>

        <footer class="panel-footer">
          <p>
            {{ $t('auth.wantTour', 'Want a quick tour instead?') }}
            <RouterLink
              :to="`/${$route.params.locale || 'en-US'}/about`"
              class="panel-link"
            >
              {{ $t('auth.visitAbout', 'Visit the About page') }}
            </RouterLink>
          </p>
        </footer>
      </section>
    </div>

    <PlanComparisonModal
      v-if="showPlanModal"
      :is-open="showPlanModal"
      :basic-plan="basicPlan"
      :creator-plan="creatorPlan"
      :organization-plan="organizationPlan"
      @close="closePlanModal"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/abstracts/variables' as v;
@use '@/styles/abstracts/mixins' as m;

.login-page {
  min-height: 100vh;
  padding: clamp(2.5rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(ellipse at top left,
      hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.22),
      transparent 55%),
    radial-gradient(ellipse at bottom right,
      hsla(var(--color-accent-secondary-h), var(--color-accent-secondary-s), var(--color-accent-secondary-l), 0.2),
      transparent 60%),
    hsl(var(--color-bg-primary-h), var(--color-bg-primary-s), var(--color-bg-primary-l));
}

.login-shell {
  width: min(1150px, 100%);
  display: grid;
  gap: clamp(2rem, 4vw, 4rem);
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  align-items: stretch;
}

.login-hero {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  color: hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l));
}

.hero-logo {
  width: clamp(72px, 9vw, 110px);
  height: clamp(72px, 9vw, 110px);
  border-radius: 32px;
  background: hsla(var(--color-bg-secondary-h), var(--color-bg-secondary-s), var(--color-bg-secondary-l), 0.5);
  display: grid;
  place-items: center;
  backdrop-filter: blur(12px);
  box-shadow: 0 20px 45px -20px hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.45);

  img {
    width: 60%;
    height: auto;
  }
}

.hero-title {
  font-size: clamp(1.75rem, 2.4vw, 2.5rem);
  line-height: 1.2;
  font-weight: 700;
}

.hero-subtitle {
  font-size: clamp(1rem, 1.2vw, 1.125rem);
  color: hsl(var(--color-text-secondary-h), var(--color-text-secondary-s), var(--color-text-secondary-l));
  max-width: 38ch;
}

.hero-highlights {
  display: grid;
  gap: 0.75rem;
  padding: 0;
  margin: 0;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    color: hsl(var(--color-text-secondary-h), var(--color-text-secondary-s), var(--color-text-secondary-l));

    &::before {
      content: '';
      width: 0.65rem;
      height: 0.65rem;
      border-radius: 999px;
      background: linear-gradient(135deg,
        hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l)),
        hsl(var(--color-accent-secondary-h), var(--color-accent-secondary-s), var(--color-accent-secondary-l)));
      box-shadow: 0 0 0 4px hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.15);
    }
  }
}

.hero-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.hero-plan-button {
  align-self: flex-start;
  padding: 0.8rem 1.6rem;
  border-radius: 999px;
  font-weight: 600;
  color: hsl(var(--color-text-on-primary-h), var(--color-text-on-primary-s), var(--color-text-on-primary-l));
  background: linear-gradient(135deg,
    hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l)),
    hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l)));
  border: none;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -12px hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.5);
  }
}

.hero-note {
  font-size: 0.95rem;
  color: hsl(var(--color-text-secondary-h), var(--color-text-secondary-s), var(--color-text-secondary-l));
}

.login-panel {
  padding: clamp(2rem, 3vw, 2.5rem);
  border-radius: 28px;
  background: hsla(var(--color-bg-primary-h), var(--color-bg-primary-s), var(--color-bg-primary-l), 0.78);
  box-shadow: 0 30px 70px -40px hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.3);
  backdrop-filter: blur(24px);
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.panel-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.panel-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.18);
  color: hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l));
}

.panel-title {
  font-size: 1.35rem;
  font-weight: 600;
}

.panel-subtitle {
  margin-top: 0.25rem;
  color: hsl(var(--color-text-secondary-h), var(--color-text-secondary-s), var(--color-text-secondary-l));
  font-size: 0.95rem;
}

.panel-tabs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
  background: hsla(var(--color-bg-secondary-h), var(--color-bg-secondary-s), var(--color-bg-secondary-l), 0.45);
  padding: 0.4rem;
  border-radius: 999px;
}

.panel-tab {
  border: none;
  background: transparent;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.6rem 1rem;
  border-radius: 999px;
  color: hsl(var(--color-text-secondary-h), var(--color-text-secondary-s), var(--color-text-secondary-l));
  transition: background 0.2s ease, color 0.2s ease;
  cursor: pointer;

  &.active {
    background: hsl(var(--color-bg-primary-h), var(--color-bg-primary-s), calc(var(--color-bg-primary-l) - 3%));
    color: hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l));
    box-shadow: 0 8px 18px -12px hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.35);
  }
}

.panel-form {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;

  label {
    font-weight: 600;
    font-size: 0.9rem;
    color: hsl(var(--color-text-secondary-h), var(--color-text-secondary-s), var(--color-text-secondary-l));
  }

  input {
    width: 100%;
    padding: 0.85rem 1rem;
    border-radius: 14px;
    border: 1px solid hsla(var(--color-border-primary-h), var(--color-border-primary-s), var(--color-border-primary-l), 0.4);
    background: hsla(var(--color-bg-secondary-h), var(--color-bg-secondary-s), var(--color-bg-secondary-l), 0.35);
    color: hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l));
    transition: border 0.2s ease, box-shadow 0.2s ease;

    &:focus {
      border-color: hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l));
      box-shadow: 0 0 0 3px hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.25);
      outline: none;
    }
  }
}

.input-with-toggle {
  position: relative;

  input {
    padding-right: 3rem;
  }
}

.toggle-visibility {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  border: none;
  background: none;
  color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
  cursor: pointer;
  display: grid;
  place-items: center;

  &:hover {
    color: hsl(var(--color-text-secondary-h), var(--color-text-secondary-s), var(--color-text-secondary-l));
  }

  svg {
    width: 1.15rem;
    height: 1.15rem;
  }
}

.remember-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: hsl(var(--color-text-secondary-h), var(--color-text-secondary-s), var(--color-text-secondary-l));

  input {
    width: 1rem;
    height: 1rem;
  }
}

.primary-button {
  border: none;
  border-radius: 14px;
  padding: 0.9rem 1rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: hsl(var(--color-text-on-primary-h), var(--color-text-on-primary-s), var(--color-text-on-primary-l));
  background: linear-gradient(135deg,
    hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l)),
    hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l)));
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 15px 35px -20px hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.5);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.button-spinner {
  width: 1.15rem;
  height: 1.15rem;
  border-radius: 999px;
  border: 2px solid hsla(var(--color-text-on-primary-h), var(--color-text-on-primary-s), var(--color-text-on-primary-l), 0.4);
  border-top-color: hsl(var(--color-text-on-primary-h), var(--color-text-on-primary-s), var(--color-text-on-primary-l));
  animation: spin 0.75s linear infinite;
}

.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.error-card {
  display: flex;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  background: hsla(var(--color-error-h), var(--color-error-s), var(--color-error-l), 0.18);
  color: hsl(var(--color-error-h), var(--color-error-s), calc(var(--color-error-l) - 18%));
  border: 1px solid hsla(var(--color-error-h), var(--color-error-s), var(--color-error-l), 0.45);
  font-size: 0.9rem;
}

.error-icon {
  width: 1.1rem;
  height: 1.1rem;
}

.oauth-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.oauth-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
}

.oauth-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.oauth-button {
  flex: 1 1 140px;
  border-radius: 12px;
  border: 1px solid hsla(var(--color-border-primary-h), var(--color-border-primary-s), var(--color-border-primary-l), 0.4);
  padding: 0.75rem 1rem;
  background: hsla(var(--color-bg-secondary-h), var(--color-bg-secondary-s), var(--color-bg-secondary-l), 0.25);
  color: hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l));
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, border 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    border-color: hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l));
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.panel-footer {
  font-size: 0.9rem;
  color: hsl(var(--color-text-secondary-h), var(--color-text-secondary-s), var(--color-text-secondary-l));

  .panel-link {
    margin-left: 0.35rem;
    color: hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l));
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.login-fade-enter-active,
.login-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.login-fade-enter-from,
.login-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 960px) {
  .login-shell {
    grid-template-columns: 1fr;
  }

  .login-panel {
    order: -1;
  }
}
</style>
