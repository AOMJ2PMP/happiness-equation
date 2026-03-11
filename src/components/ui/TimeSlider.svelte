<script>
  let {
    min = 2005,
    max = 2023,
    value = 2023,
    playing = false,
    onChange = () => {},
    onTogglePlay = () => {},
  } = $props();
</script>

<div class="time-slider">
  <button class="play-btn" onclick={onTogglePlay} aria-label={playing ? "Pause" : "Play"}>
    {#if playing}
      <svg width="14" height="14" viewBox="0 0 14 14"><rect x="2" y="1" width="3.5" height="12" fill="currentColor"/><rect x="8.5" y="1" width="3.5" height="12" fill="currentColor"/></svg>
    {:else}
      <svg width="14" height="14" viewBox="0 0 14 14"><polygon points="3,1 12,7 3,13" fill="currentColor"/></svg>
    {/if}
  </button>
  <input
    type="range"
    {min}
    {max}
    {value}
    step="1"
    oninput={(e) => onChange(Number(e.target.value))}
    aria-label="Year"
  />
  <span class="year-label">{value}</span>
</div>

<style>
  .time-slider {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  .play-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #4e79a7;
    color: white;
    border: none;
    cursor: pointer;
    flex-shrink: 0;
    padding: 0;
  }

  .play-btn:hover {
    background: #3a5f8a;
  }

  input[type="range"] {
    flex: 1;
    accent-color: #4e79a7;
    height: 4px;
  }

  .year-label {
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 600;
    color: #333;
    min-width: 40px;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
</style>
