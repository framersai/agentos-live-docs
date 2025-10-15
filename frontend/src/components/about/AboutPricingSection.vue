<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { CurrencyDollarIcon, CheckIcon } from '@heroicons/vue/24/outline';
import { usePlans } from '@/composables/usePlans';
import PlanComparisonModal from '@/components/plan/PlanComparisonModal.vue';

const { t } = useI18n();
const { plans, featuredPlan, standardPlans } = usePlans();

const showComparison = ref(false);

interface PlanCardViewModel {
  id: string;
  title: string;
  priceText: string;
  allowance: string;
  allowanceNote?: string;
  bullets: string[];
  ctaLabel: string;
  isFeatured: boolean;
  requiresContact: boolean;
}

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

const formatNumber = (value?: number | null): string => (value == null ? '-' : value.toLocaleString());

const priceLabel = (monthlyPrice: number): string => (
  monthlyPrice === 0 ? t('plans.free') : t('plans.pricePerMonth', { price: priceFormatter.format(monthlyPrice) })
);

const allowanceLabel = (tokens: number): string => t('plans.dailyAllowancePrimaryShort', { tokens: formatNumber(tokens) });

const buildCardModel = (plan = featuredPlan.value): PlanCardViewModel | null => {
  if (!plan) return null;
  return {
    id: plan.id,
    title: plan.displayName,
    priceText: priceLabel(plan.monthlyPriceUsd),
    allowance: allowanceLabel(plan.usage.approxGpt4oTokensPerDay),
    allowanceNote: plan.usage.notes,
    bullets: plan.bullets,
    ctaLabel: plan.metadata?.requiresContact
      ? t('plans.contactUsCta')
      : plan.monthlyPriceUsd === 0
        ? t('plans.startFreeCta')
        : t('plans.choosePlanCta'),
    isFeatured: Boolean(plan.metadata?.featured),
    requiresContact: Boolean(plan.metadata?.requiresContact),
  };
};

const featuredCard = computed(() => buildCardModel(featuredPlan.value));
const standardCards = computed(() => standardPlans.value.map((plan) => buildCardModel(plan)).filter(Boolean) as PlanCardViewModel[]);

const onOpenComparison = () => {
  showComparison.value = true;
};

const onCloseComparison = () => {
  showComparison.value = false;
};
</script>

<template>
  <section id="pricing" class="pricing-section-about content-section-ephemeral">
    <header class="pricing-header">
      <h3 class="section-title-main"><CurrencyDollarIcon class="section-title-icon" />{{ t('plans.sectionTitle') }}</h3>
      <button type="button" class="btn btn-ghost-ephemeral plan-compare-button" @click="onOpenComparison">
        {{ t('plans.viewComparison') }}
      </button>
    </header>
    <div class="pricing-grid-about">
      <div
        v-if="featuredCard"
        class="pricing-plan-card-about card-neo-interactive featured-plan-glow"
      >
        <div class="featured-chip-about">{{ t('plans.mostPopular') }}</div>
        <h4 class="plan-title-about">{{ featuredCard.title }}</h4>
        <div class="plan-price-container-about">
          <span class="plan-price-value">{{ featuredCard.priceText }}</span>
        </div>
        <p class="plan-allowance">{{ featuredCard.allowance }}</p>
        <p v-if="featuredCard.allowanceNote" class="plan-allowance-note">{{ featuredCard.allowanceNote }}</p>
        <ul class="plan-features-list-about">
          <li v-for="bullet in featuredCard.bullets" :key="bullet" class="plan-feature-item">
            <CheckIcon class="feature-icon icon-success" />
            {{ bullet }}
          </li>
        </ul>
        <button class="btn plan-button-about btn-primary-ephemeral">
          {{ featuredCard.ctaLabel }}
        </button>
      </div>

      <div
        v-for="plan in standardCards"
        :key="plan.id"
        class="pricing-plan-card-about card-glass-interactive"
      >
        <h4 class="plan-title-about">{{ plan.title }}</h4>
        <div class="plan-price-container-about">
          <span class="plan-price-value">{{ plan.priceText }}</span>
        </div>
        <p class="plan-allowance">{{ plan.allowance }}</p>
        <p v-if="plan.allowanceNote" class="plan-allowance-note">{{ plan.allowanceNote }}</p>
        <ul class="plan-features-list-about">
          <li v-for="bullet in plan.bullets" :key="bullet" class="plan-feature-item">
            <CheckIcon class="feature-icon icon-success" />
            {{ bullet }}
          </li>
        </ul>
        <button class="btn plan-button-about btn-secondary-ephemeral">
          {{ plan.ctaLabel }}
        </button>
      </div>
    </div>
    <PlanComparisonModal :open="showComparison" @close="onCloseComparison" />
  </section>
</template>

<style scoped lang="scss">
.pricing-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.plan-compare-button {
  font-size: 0.85rem;
  padding-inline: 1rem;
}

.plan-allowance {
  font-weight: 600;
  margin-top: 0.75rem;
}

.plan-allowance-note {
  margin-top: 0.35rem;
  font-size: 0.8rem;
  color: hsla(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l), 0.9);
}
</style>
