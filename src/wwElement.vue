<template>
  <section class="pt-root">

    <!-- Section header -->
    <div v-if="heading || subheading" class="pt-header">
      <h2 v-if="heading" class="pt-heading">{{ heading }}</h2>
      <p v-if="subheading" class="pt-subheading">{{ subheading }}</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="pt-loading">
      <span class="pt-spinner" aria-label="Loading testimonials"></span>
    </div>

    <!-- Empty -->
    <div v-else-if="testimonials.length === 0 && !loading" class="pt-empty">
      No published reviews yet.
    </div>

    <!-- Grid -->
    <div
      v-else
      class="pt-grid"
      :style="{ '--pt-cols': columns }"
      aria-label="Customer reviews"
    >
      <article
        v-for="review in testimonials"
        :key="review.id"
        class="pt-card"
      >
        <!-- Stars -->
        <div class="pt-stars" :aria-label="`${review.rating} out of 5 stars`">
          <span
            v-for="n in 5"
            :key="n"
            class="pt-star"
            :class="{ 'pt-star--on': n <= review.rating }"
            aria-hidden="true"
          >★</span>
        </div>

        <!-- Comment -->
        <p class="pt-comment" v-if="review.comment">"{{ review.comment }}"</p>

        <!-- Footer -->
        <footer class="pt-card-footer">
          <div class="pt-reviewer">
            <div class="pt-reviewer-avatar" aria-hidden="true">{{ reviewerInitial(review.member_name) }}</div>
            <div class="pt-reviewer-info">
              <span class="pt-reviewer-name">{{ review.member_name || 'Spread Member' }}</span>
              <span class="pt-reviewer-meta">{{ review.category_name }} · {{ formatDate(review.created_at) }}</span>
            </div>
          </div>
        </footer>
      </article>
    </div>

  </section>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

// ── Inline Supabase client ────────────────────────────────────────────────
function createSpreadClient(supabaseUrl, supabaseAnonKey) {
  const headers = { 'Content-Type': 'application/json', 'apikey': supabaseAnonKey };
  return {
    async rpc(fn, params = {}) {
      const res = await fetch(`${supabaseUrl}/rest/v1/rpc/${fn}`, {
        method: 'POST', headers, body: JSON.stringify(params),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.message || res.statusText);
      }
      return res.json();
    },
  };
}

export default {
  props: {
    uid: { type: String, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
    content:        { type: Object, required: true },
    wwFrontState:   { type: Object, required: true },
    wwElementState: { type: Object, required: true },
  },
  emits: ['trigger-event'],

  setup(props) {
    const supabaseUrl     = computed(() => props.content?.supabaseUrl || '');
    const supabaseAnonKey = computed(() => props.content?.supabaseAnonKey || '');
    const heading         = computed(() => props.content?.heading ?? 'What our members say');
    const subheading      = computed(() => props.content?.subheading ?? '');
    const limit           = computed(() => props.content?.limit ?? 9);
    const columns         = computed(() => props.content?.columns ?? '3');

    const testimonials    = ref([]);
    const loading         = ref(false);

    async function loadTestimonials() {
      if (!supabaseUrl.value || !supabaseAnonKey.value) return;
      loading.value = true;
      try {
        const client = createSpreadClient(supabaseUrl.value, supabaseAnonKey.value);
        const data = await client.rpc('get_published_reviews', { p_limit: limit.value });
        testimonials.value = Array.isArray(data) ? data : [];
      } catch (_) {
        testimonials.value = [];
      } finally {
        loading.value = false;
      }
    }

    function reviewerInitial(name) {
      if (!name || !name.trim()) return '?';
      return name.trim().charAt(0).toUpperCase();
    }

    function formatDate(iso) {
      if (!iso) return '';
      try {
        return new Date(iso).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' });
      } catch (_) { return ''; }
    }

    onMounted(loadTestimonials);

    // ── Editor mock ───────────────────────────────────────────────────────
    /* wwEditor:start */
    testimonials.value = [
      { id: '1', member_name: 'Sarah M.', rating: 5, comment: 'Absolutely love the fresh produce. Everything arrived perfectly packed and the quality is unbeatable.', category_name: 'Product Quality', created_at: '2025-06-01T00:00:00Z' },
      { id: '2', member_name: 'James P.', rating: 5, comment: 'Delivery is super fast and the box is always so well presented. Highly recommend!', category_name: 'Delivery', created_at: '2025-05-15T00:00:00Z' },
      { id: '3', member_name: 'Priya L.', rating: 4, comment: 'Great selection and the locally-sourced options are a huge bonus. My family looks forward to every box.', category_name: 'Overall Experience', created_at: '2025-05-08T00:00:00Z' },
      { id: '4', member_name: 'Daniel K.', rating: 5, comment: 'The farmers\' market feel at home. Nothing beats knowing exactly where your food comes from.', category_name: 'Product Quality', created_at: '2025-04-20T00:00:00Z' },
      { id: '5', member_name: 'Emma R.', rating: 4, comment: 'Seamless experience from start to finish. Customer support was also very helpful when I had a query.', category_name: 'Overall Experience', created_at: '2025-04-10T00:00:00Z' },
      { id: '6', member_name: 'Noah T.', rating: 5, comment: 'Freshest eggs I\'ve ever tasted. The seasonal produce keeps things exciting each week.', category_name: 'Product Quality', created_at: '2025-03-28T00:00:00Z' },
    ];
    /* wwEditor:end */

    return { heading, subheading, columns, testimonials, loading, reviewerInitial, formatDate };
  },
};
</script>

<style scoped>
/* ── Design tokens ─────────────────────────────────────────────────────── */
.pt-root {
  --pt-primary: #4B162D;
  --pt-accent: #C86A3A;
  --pt-sand: #EDC79F;
  --pt-sand-light: #FAF7F2;
  --pt-bg: #FFFFFF;
  --pt-border: #E8DDD4;
  --pt-text: #1A0A10;
  --pt-text-secondary: #6B5B52;
  --pt-success: #16A34A;
  --pt-font: 'Work Sans', -apple-system, sans-serif;
  --pt-radius-sm: 6px;
  --pt-radius-md: 12px;
  --pt-radius-lg: 18px;
  --pt-shadow: 0 2px 12px rgba(75, 22, 45, 0.06);
  --pt-shadow-hover: 0 6px 24px rgba(75, 22, 45, 0.12);

  padding: 48px 24px;
  font-family: var(--pt-font);
  color: var(--pt-text);
  box-sizing: border-box;
}

/* ── Header ────────────────────────────────────────────────────────────── */
.pt-header {
  text-align: center;
  margin-bottom: 44px;
}

.pt-heading {
  font-size: clamp(28px, 5vw, 42px);
  font-weight: 800;
  color: var(--pt-primary);
  margin: 0 0 12px;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.pt-subheading {
  font-size: 16px;
  color: var(--pt-text-secondary);
  margin: 0;
  max-width: 520px;
  margin-inline: auto;
  line-height: 1.6;
}

/* ── Grid ──────────────────────────────────────────────────────────────── */
.pt-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 640px) {
  .pt-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .pt-grid { grid-template-columns: repeat(var(--pt-cols, 3), 1fr); }
}

/* ── Card ──────────────────────────────────────────────────────────────── */
.pt-card {
  background: var(--pt-bg);
  border: 1.5px solid var(--pt-border);
  border-left: 4px solid var(--pt-sand);
  border-radius: var(--pt-radius-md);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: var(--pt-shadow);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.pt-card:hover {
  box-shadow: var(--pt-shadow-hover);
  border-left-color: var(--pt-accent);
}

/* ── Stars ─────────────────────────────────────────────────────────────── */
.pt-stars {
  display: flex;
  gap: 2px;
}

.pt-star {
  font-size: 18px;
  color: var(--pt-border);
  line-height: 1;
}

.pt-star--on {
  color: var(--pt-accent);
}

/* ── Comment ───────────────────────────────────────────────────────────── */
.pt-comment {
  font-size: 15px;
  line-height: 1.65;
  color: var(--pt-text);
  margin: 0;
  flex: 1;
  font-style: italic;
}

/* ── Footer / reviewer ─────────────────────────────────────────────────── */
.pt-card-footer {
  margin-top: auto;
}

.pt-reviewer {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pt-reviewer-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--pt-primary);
  color: var(--pt-sand);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  flex-shrink: 0;
}

.pt-reviewer-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.pt-reviewer-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--pt-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pt-reviewer-meta {
  font-size: 12px;
  color: var(--pt-text-secondary);
}

/* ── Loading / empty ───────────────────────────────────────────────────── */
.pt-loading {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.pt-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--pt-border);
  border-top-color: var(--pt-accent);
  border-radius: 50%;
  animation: pt-spin 0.65s linear infinite;
  display: inline-block;
}

@keyframes pt-spin { to { transform: rotate(360deg); } }

.pt-empty {
  text-align: center;
  padding: 40px 0;
  color: var(--pt-text-secondary);
  font-size: 15px;
}

/* ── Tablet ────────────────────────────────────────────────────────────── */
@media (min-width: 768px) {
  .pt-root { padding: 64px 40px; }
}

/* ── Desktop ───────────────────────────────────────────────────────────── */
@media (min-width: 1024px) {
  .pt-root { padding: 80px 60px; }
}

/* ── Large desktop ─────────────────────────────────────────────────────── */
@media (min-width: 1440px) {
  .pt-root { max-width: 1280px; margin-inline: auto; }
}
</style>
