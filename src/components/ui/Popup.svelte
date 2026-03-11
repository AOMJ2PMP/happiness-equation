<script>
  import BarDecompose from "$components/chart/BarDecompose.svelte";
  import { getRegionColor } from "$components/helpers/chartUtils.js";

  let { country = null, onClose = () => {} } = $props();

  // Build sparkline data from history
  const sparkData = $derived.by(() => {
    if (!country?.history) return [];
    return Object.entries(country.history)
      .filter(([, d]) => d.score !== null)
      .map(([year, d]) => ({ year: Number(year), score: d.score }))
      .sort((a, b) => a.year - b.year);
  });

  const sparkWidth = 240;
  const sparkHeight = 50;
  const sparkPad = 4;

  const sparkPath = $derived.by(() => {
    if (sparkData.length < 2) return "";
    const years = sparkData.map((d) => d.year);
    const scores = sparkData.map((d) => d.score);
    const xMin = Math.min(...years);
    const xMax = Math.max(...years);
    const yMin = Math.min(...scores) - 0.3;
    const yMax = Math.max(...scores) + 0.3;

    return sparkData
      .map((d, i) => {
        const x = sparkPad + ((d.year - xMin) / (xMax - xMin)) * (sparkWidth - 2 * sparkPad);
        const y = sparkHeight - sparkPad - ((d.score - yMin) / (yMax - yMin)) * (sparkHeight - 2 * sparkPad);
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
  });

  function handleKeydown(e) {
    if (e.key === "Escape") onClose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if country}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="popup-overlay" onclick={onClose}>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="popup-card" onclick={(e) => e.stopPropagation()}>
      <button class="popup-close" onclick={onClose} aria-label="Close">&times;</button>

      <div class="popup-header">
        <span class="region-dot" style="background: {getRegionColor(country.region)}"></span>
        <div>
          <h2>{country.name}</h2>
          <div class="popup-region">{country.region}</div>
        </div>
      </div>

      <div class="popup-meta">
        {#if country.rank}
          <span class="meta-item">Rank <strong>#{country.rank}</strong></span>
        {/if}
        {#if country.score2024}
          <span class="meta-item">Score <strong>{country.score2024.toFixed(2)}</strong></span>
        {/if}
      </div>

      <BarDecompose {country} />

      {#if sparkData.length >= 2}
        <div class="sparkline-section">
          <div class="sparkline-label">Happiness score over time ({sparkData[0].year}–{sparkData[sparkData.length - 1].year})</div>
          <svg width={sparkWidth} height={sparkHeight} viewBox="0 0 {sparkWidth} {sparkHeight}">
            <path d={sparkPath} fill="none" stroke={getRegionColor(country.region)} stroke-width="2" />
          </svg>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .popup-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  }

  .popup-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    max-width: 400px;
    width: calc(100% - 40px);
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    position: relative;
    font-family: var(--sans);
  }

  .popup-close {
    position: absolute;
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    font-size: 24px;
    color: #999;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }

  .popup-close:hover {
    color: #333;
    background: none;
  }

  .popup-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
  }

  .popup-header h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
  }

  .popup-region {
    font-size: 12px;
    color: #666;
    margin-top: 2px;
  }

  .region-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 4px;
  }

  .popup-meta {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    font-size: 13px;
    color: #555;
  }

  .meta-item strong {
    color: #222;
  }

  .sparkline-section {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #eee;
  }

  .sparkline-label {
    font-size: 11px;
    color: #888;
    margin-bottom: 6px;
  }

  .sparkline-section svg {
    display: block;
  }
</style>
