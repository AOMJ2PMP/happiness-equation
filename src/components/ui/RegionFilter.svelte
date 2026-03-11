<script>
  import { REGIONS, getRegionColor } from "$components/helpers/chartUtils.js";

  let { disabledRegions = [], onToggle = () => {} } = $props();

  const SHORT_LABELS = {
    "Western Europe": "W. Europe",
    "Central and Eastern Europe": "E. Europe",
    "Commonwealth of Independent States": "CIS",
    "East Asia": "E. Asia",
    "Southeast Asia": "SE Asia",
    "South Asia": "S. Asia",
    "Latin America and Caribbean": "LatAm",
    "Middle East and North Africa": "MENA",
    "North America and ANZ": "N. America",
    "Sub-Saharan Africa": "Africa",
  };
</script>

<div class="region-filter">
  <div class="filter-label">Regions</div>
  <div class="filter-grid">
    {#each REGIONS as region}
      {@const disabled = disabledRegions.includes(region)}
      <button
        class="region-btn"
        class:disabled
        onclick={() => onToggle(region)}
        title={region}
        aria-pressed={!disabled}
      >
        <span class="dot" style="background: {disabled ? '#ccc' : getRegionColor(region)}"></span>
        <span>{SHORT_LABELS[region] || region}</span>
      </button>
    {/each}
  </div>
</div>

<style>
  .region-filter {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .filter-label {
    font-size: 11px;
    font-weight: 600;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .filter-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3px;
  }

  .region-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 4px 7px;
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 500;
    background: #f5f4f0;
    border: 1px solid transparent;
    border-radius: 6px;
    cursor: pointer;
    color: #444;
    transition: background 0.12s, opacity 0.2s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }

  .region-btn:hover {
    background: #eeede9;
  }

  .region-btn.disabled {
    opacity: 0.4;
    background: #f5f4f0;
  }

  .region-btn.disabled:hover {
    background: #eeede9;
    opacity: 0.5;
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
    transition: background 0.2s;
  }
</style>
