<script>
  import { getValue, DIMENSIONS, getRegionColor } from "$components/helpers/chartUtils.js";

  let { country = null, x = 0, y = 0, xDim = "gdp", yDim = "score2024" } = $props();
</script>

{#if country}
  <div
    class="tooltip"
    style="left: {x + 12}px; top: {y - 12}px;"
  >
    <div class="tooltip-name">{country.name}</div>
    <div class="tooltip-region">
      <span class="region-dot" style="background: {getRegionColor(country.region)}"></span>
      {country.region}
    </div>
    {#if country.rank}
      <div class="tooltip-rank">Rank #{country.rank}</div>
    {/if}
    <div class="tooltip-values">
      <div>{DIMENSIONS[yDim]?.label}: <strong>{getValue(country, yDim)?.toFixed(3) ?? "N/A"}</strong></div>
      <div>{DIMENSIONS[xDim]?.label}: <strong>{getValue(country, xDim)?.toFixed(3) ?? "N/A"}</strong></div>
    </div>
  </div>
{/if}

<style>
  .tooltip {
    position: absolute;
    pointer-events: none;
    background: white;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 10px 14px;
    font-family: var(--sans);
    font-size: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
    z-index: 1000;
    max-width: 220px;
    line-height: 1.4;
  }

  .tooltip-name {
    font-weight: 700;
    font-size: 14px;
    margin-bottom: 2px;
  }

  .tooltip-region {
    color: #666;
    font-size: 11px;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 6px;
  }

  .region-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
  }

  .tooltip-rank {
    font-size: 11px;
    color: #888;
    margin-bottom: 6px;
  }

  .tooltip-values div {
    margin-bottom: 2px;
  }

  .tooltip-values strong {
    color: #333;
  }
</style>
