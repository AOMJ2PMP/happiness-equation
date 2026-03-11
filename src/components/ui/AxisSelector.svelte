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
    <label for="y-axis">Y axis</label>
    <select id="y-axis" value={yDim} onchange={(e) => onChangeY(e.target.value)}>
      {#each dims as d}
        <option value={d.value}>{d.label}</option>
      {/each}
    </select>
  </div>
  <div class="selector-group">
    <label for="x-axis">X axis</label>
    <select id="x-axis" value={xDim} onchange={(e) => onChangeX(e.target.value)}>
      {#each dims as d}
        <option value={d.value}>{d.label}</option>
      {/each}
    </select>
  </div>
</div>

<style>
  .axis-selector {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .selector-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  label {
    font-size: 11px;
    font-weight: 600;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    width: 36px;
    flex-shrink: 0;
  }

  select {
    font-family: var(--sans);
    font-size: 12px;
    font-weight: 500;
    padding: 5px 24px 5px 9px;
    border: 1px solid #dedad4;
    border-radius: 7px;
    background: white;
    color: #222;
    cursor: pointer;
    outline: none;
    flex: 1;
    min-width: 0;
    transition: border-color 0.15s;
  }

  select:focus {
    border-color: #4e79a7;
    box-shadow: 0 0 0 3px rgba(78, 121, 167, 0.12);
  }

  select:hover {
    border-color: #c8c4bc;
  }
</style>
