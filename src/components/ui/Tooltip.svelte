<script>
  import { getValue, DIMENSIONS, getRegionColor } from "$components/helpers/chartUtils.js";

  let { country = null, x = 0, y = 0, xDim = "gdp", yDim = "score2024" } = $props();

  const regionColor = $derived(country ? getRegionColor(country.region) : "#999");
</script>

{#if country}
  <div
    class="tooltip"
    style="left: {x + 14}px; top: {y - 14}px;"
  >
    <div class="tooltip-accent" style="background: {regionColor}"></div>
    <div class="tooltip-body">
      <div class="tooltip-name">{country.name}</div>
      <div class="tooltip-region">
        {country.region}
      </div>
      {#if country.rank}
        <div class="tooltip-rank">Rank #{country.rank}</div>
      {/if}
      <div class="tooltip-values">
        <div class="tt-row">
          <span class="tt-key">{DIMENSIONS[yDim]?.label}</span>
          <span class="tt-val">{getValue(country, yDim)?.toFixed(3) ?? "N/A"}</span>
        </div>
        <div class="tt-row">
          <span class="tt-key">{DIMENSIONS[xDim]?.label}</span>
          <span class="tt-val">{getValue(country, xDim)?.toFixed(3) ?? "N/A"}</span>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .tooltip {
    position: fixed;
    pointer-events: none;
    background: white;
    border-radius: 10px;
    font-family: var(--sans);
    box-shadow:
      0 2px 8px rgba(0,0,0,0.10),
      0 8px 24px rgba(0,0,0,0.08);
    z-index: 1000;
    max-width: 220px;
    overflow: hidden;
    border: 1px solid rgba(0,0,0,0.06);
  }

  .tooltip-accent {
    height: 4px;
    width: 100%;
  }

  .tooltip-body {
    padding: 10px 14px 12px;
    line-height: 1.4;
  }

  .tooltip-name {
    font-weight: 700;
    font-size: 14px;
    color: #111;
    margin-bottom: 2px;
  }

  .tooltip-region {
    color: #888;
    font-size: 11px;
    margin-bottom: 8px;
  }

  .tooltip-rank {
    font-size: 11px;
    color: #aaa;
    margin-bottom: 6px;
  }

  .tooltip-values {
    display: flex;
    flex-direction: column;
    gap: 4px;
    border-top: 1px solid #f0ede8;
    padding-top: 8px;
  }

  .tt-row {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    font-size: 12px;
  }

  .tt-key {
    color: #888;
  }

  .tt-val {
    font-weight: 600;
    color: #222;
    font-variant-numeric: tabular-nums;
  }
</style>
