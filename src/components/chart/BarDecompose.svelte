<script>
  import { FACTOR_LABELS, FACTOR_COLORS } from "$components/helpers/dataUtils.js";

  let { country } = $props();

  const factors = ["gdp", "social", "health", "freedom", "generosity", "corruption", "dystopiaResidual"];

  const total = $derived(
    country?.contributions
      ? factors.reduce((sum, f) => sum + (country.contributions[f] ?? 0), 0)
      : 0
  );

  const maxBarWidth = 260;
</script>

{#if country?.contributions}
  <div class="bar-decompose">
    <div class="bar-title">Score breakdown: <strong>{country.score2024?.toFixed(2)}</strong></div>
    <div class="bars">
      {#each factors as factor}
        {@const val = country.contributions[factor]}
        {#if val !== null && val !== undefined}
          {@const pct = total > 0 ? (val / total) * 100 : 0}
          <div class="bar-row">
            <div class="bar-label">{FACTOR_LABELS[factor]}</div>
            <div class="bar-track">
              <div
                class="bar-fill"
                style="width: {pct}%; background: {FACTOR_COLORS[factor]};"
              ></div>
            </div>
            <div class="bar-value">{val.toFixed(3)}</div>
          </div>
        {/if}
      {/each}
    </div>
  </div>
{:else}
  <div class="bar-decompose">
    <p class="no-data">Factor data unavailable for this country.</p>
  </div>
{/if}

<style>
  .bar-decompose {
    font-family: var(--sans);
    font-size: 12px;
  }

  .bar-title {
    font-size: 13px;
    margin-bottom: 10px;
    color: #333;
  }

  .bar-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 5px;
  }

  .bar-label {
    width: 120px;
    flex-shrink: 0;
    color: #555;
    font-size: 11px;
    text-align: right;
  }

  .bar-track {
    flex: 1;
    height: 14px;
    background: #f0f0f0;
    border-radius: 3px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 400ms ease;
  }

  .bar-value {
    width: 40px;
    flex-shrink: 0;
    font-size: 11px;
    color: #666;
    font-variant-numeric: tabular-nums;
  }

  .no-data {
    color: #999;
    font-style: italic;
  }
</style>
