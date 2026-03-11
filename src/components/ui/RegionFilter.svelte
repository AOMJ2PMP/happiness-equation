<script>
  import { REGIONS, getRegionColor } from "$components/helpers/chartUtils.js";

  let { disabledRegions = [], onToggle = () => {} } = $props();

  function toggle(region) {
    onToggle(region);
  }

  // Short labels for space
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
  {#each REGIONS as region}
    {@const disabled = disabledRegions.includes(region)}
    <button
      class="region-btn"
      class:disabled
      onclick={() => toggle(region)}
      title={region}
      aria-pressed={!disabled}
    >
      <span class="region-dot" style="background: {disabled ? '#ccc' : getRegionColor(region)}"></span>
      <span class="region-label">{SHORT_LABELS[region] || region}</span>
    </button>
  {/each}
</div>

<style>
  .region-filter {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .region-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    font-family: var(--sans);
    font-size: 11px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 14px;
    cursor: pointer;
    color: #333;
    transition: opacity 0.2s, background 0.15s;
    white-space: nowrap;
  }

  .region-btn:hover {
    background: #f5f5f5;
  }

  .region-btn.disabled {
    opacity: 0.4;
    background: #fafafa;
  }

  .region-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    transition: background 0.2s;
  }

  .region-label {
    line-height: 1;
  }
</style>
