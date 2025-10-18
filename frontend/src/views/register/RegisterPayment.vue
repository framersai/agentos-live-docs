<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useRegistrationStore } from '@/store/registration.store';
import { usePlans } from '@/composables/usePlans';
import type { PlanCatalogEntry } from '../../../shared/planCatalog';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const registrationStore = useRegistrationStore();
const { findPlan } = usePlans();

const isCreatingCheckout = ref(false);
const errorMessage = ref<string | null>(null);

const selectedPlan = computed<PlanCatalogEntry | null>(() => {
  if (!registrationStore.plan?.planId) return null;
  try {
    return findPlan(registrationStore.plan.planId);
  } catch (error) {
    console.warn('[RegisterPayment] plan not found', error);
    return null;
  }
});

const handleContinueToCheckout = async () => {
  if (!selectedPlan.value) {
    errorMessage.value = t('register.payment.errors.missingPlan');
    return;
  }

  errorMessage.value = null;
  isCreatingCheckout.value = true;

  try {
    // TODO: call /api/billing/checkout and redirect to Lemon Squeezy checkout.
    await registrationStore.setCheckoutDraft({
      planId: selectedPlan.value.id,
    });

    errorMessage.value = t('register.payment.placeholders.checkoutLink');
  } catch (error: unknown) {
    console.error('[RegisterPayment] checkout creation failed', error);
    errorMessage.value = t('register.payment.errors.generic');
  } finally {
    isCreatingCheckout.value = false;
  }
};

const handleBack = () => {
  router.push({ name: 'RegisterPlan', params: { locale: route.params.locale } });
};
</script>

<template>
  <div class="register-panel">
    <header class="register-panel__header">
      <h2>{{ t('register.payment.title') }}</h2>
      <p>{{ t('register.payment.subtitle') }}</p>
    </header>

    <div v-if="selectedPlan" class="checkout-card card-glass-interactive">
      <div class="checkout-card__header">
        <h3>{{ selectedPlan.name }}</h3>
        <p>{{ selectedPlan.metadata?.displayPrice ?? selectedPlan.price }}</p>
      </div>
      <ul class="checkout-card__highlights">
        <li v-for="highlight in selectedPlan.highlights" :key="highlight">{{ highlight }}</li>
      </ul>
      <dl class="checkout-summary">
        <div>
          <dt>{{ t('register.payment.summary.email') }}</dt>
          <dd>{{ registrationStore.account.email }}</dd>
        </div>
        <div>
          <dt>{{ t('register.payment.summary.billing') }}</dt>
          <dd>{{ t('register.payment.summary.billingNote') }}</dd>
        </div>
      </dl>
    </div>

    <p v-else class="form-error">{{ t('register.payment.errors.missingPlan') }}</p>

    <div class="checkout-actions">
      <button type="button" class="btn btn-ghost-ephemeral" @click="handleBack">
        {{ t('register.actions.back') }}
      </button>
      <button
        type="button"
        class="btn btn-primary-ephemeral"
        :disabled="isCreatingCheckout"
        @click="handleContinueToCheckout"
      >
        <span v-if="!isCreatingCheckout">{{ t('register.payment.cta') }}</span>
        <span v-else>{{ t('register.actions.processing') }}</span>
      </button>
    </div>

    <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.register-panel {
  display: grid;
  gap: 1.75rem;
}

.register-panel__header {
  display: grid;
  gap: 0.45rem;
}

.checkout-card {
  display: grid;
  gap: 1.25rem;
  border-radius: 18px;
  padding: clamp(1.5rem, 3vw, 2.25rem);
  border: 1px solid hsla(335, 60%, 45%, 0.3);
}

.checkout-card__header {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.checkout-card__highlights {
  margin: 0;
  padding-left: 1.1rem;
  display: grid;
  gap: 0.35rem;
  font-size: 0.9rem;
  opacity: 0.85;
}

.checkout-summary {
  display: grid;
  gap: 0.75rem;
  margin: 0;
}

.checkout-summary div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.9rem;
  opacity: 0.85;
}

.checkout-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.form-error {
  color: hsl(8 82% 68%);
}
</style>
