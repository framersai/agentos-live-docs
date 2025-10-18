import { defineStore } from 'pinia';

interface AccountPayload {
  email: string;
  password: string;
  acceptTerms: boolean;
}

interface PlanPayload {
  planId: string;
}

interface CheckoutDraftPayload {
  planId: string;
  checkoutId?: string;
}

interface RegistrationState {
  account: {
    email: string;
    password: string;
    acceptTerms: boolean;
  };
  plan: {
    planId: string | null;
  };
  checkout: {
    checkoutId: string | null;
    status: 'idle' | 'pending' | 'complete' | 'failed';
  };
}

function loadPersistedState(): RegistrationState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem('vca-registration');
    return raw ? (JSON.parse(raw) as RegistrationState) : null;
  } catch {
    return null;
  }
}

function persistState(state: RegistrationState): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem('vca-registration', JSON.stringify(state));
  } catch (error) {
    console.warn('[registration.store] failed to persist state', error);
  }
}

const cloneState = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const initialState: RegistrationState = {
  account: {
    email: '',
    password: '',
    acceptTerms: false,
  },
  plan: {
    planId: null,
  },
  checkout: {
    checkoutId: null,
    status: 'idle',
  },
};

export const useRegistrationStore = defineStore('registration', {
  state: (): RegistrationState => loadPersistedState() ?? cloneState(initialState),

  getters: {
    isAccountComplete: (state) => Boolean(state.account.email && state.account.password),
    hasPlan: (state) => Boolean(state.plan.planId),
  },

  actions: {
    async setAccount(payload: AccountPayload) {
      this.account = {
        email: payload.email,
        password: payload.password,
        acceptTerms: payload.acceptTerms,
      };
      persistState(this.$state);
    },

    async setPlan(payload: PlanPayload) {
      this.plan = { planId: payload.planId };
      this.checkout = { checkoutId: null, status: 'pending' };
      persistState(this.$state);
    },

    async setCheckoutDraft(payload: CheckoutDraftPayload) {
      this.checkout.checkoutId = payload.checkoutId ?? null;
      this.checkout.status = 'pending';
      persistState(this.$state);
    },

    async markCheckoutComplete(checkoutId: string) {
      this.checkout = { checkoutId, status: 'complete' };
      persistState(this.$state);
    },

    reset() {
      this.$state = cloneState(initialState);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('vca-registration');
      }
    },
  },
});
