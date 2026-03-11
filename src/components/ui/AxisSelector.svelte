<script>
  import { DIMENSIONS } from "$components/helpers/chartUtils.js";

  let { xDim = "gdp", yDim = "score2024", onChangeX = () => {}, onChangeY = () => {} } = $props();

  const dims = Object.entries(DIMENSIONS).map(([key, val]) => ({
    value: key,
    label: val.label,
  }));
</script>

<div class="axis-selector">
  <div class="selector-group">
    <label for="x-axis">X Axis</label>
    <select id="x-axis" value={xDim} onchange={(e) => onChangeX(e.target.value)}>
      {#each dims as d}
        <option value={d.value}>{d.label}</option>
      {/each}
    </select>
  </div>
  <div class="selector-group">
    <label for="y-axis">Y Axis</label>
    <select id="y-axis" value={yDim} onchange={(e) => onChangeY(e.target.value)}>
      {#each dims as d}
        <option value={d.value}>{d.label}</option>
      {/each}
    </select>
  </div>
</div>

<style>
  .axis-selector {
    display: flex;
    gap: 12px;
    align-items: flex-end;
  }

  .selector-group {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  label {
    font-size: 11px;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  select {
    font-family: var(--sans);
    font-size: 13px;
    padding: 5px 24px 5px 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background: white;
    color: #333;
    cursor: pointer;
    outline: none;
  }

  select:focus {
    border-color: #4e79a7;
    outline: 2px solid rgba(78, 121, 167, 0.2);
    outline-offset: 0;
  }

  @media (max-width: 500px) {
    .axis-selector {
      flex-direction: column;
      gap: 8px;
    }

    select {
      width: 100%;
    }
  }
</style>
