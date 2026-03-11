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
      <!-- Color banner header -->
      <div class="popup-banner" style="background: {getRegionColor(country.region)}">
        <div class="popup-banner-inner">
          <div>
            <h2>{country.name}</h2>
            <div class="popup-region">{country.region}</div>
          </div>
          <div class="popup-score-badge">
            {#if country.score2024}
              <span class="score-num">{country.score2024.toFixed(2)}</span>
              <span class="score-sub">score</span>
            {/if}
          </div>
        </div>
        <button class="popup-close" onclick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="popup-content">
        {#if country.rank}
          <div class="popup-rank">Ranked <strong>#{country.rank}</strong> out of 143 countries</div>
        {/if}

        <BarDecompose {country} />

        {#if sparkData.length >= 2}
          <div class="sparkline-section">
            <div class="sparkline-label">Happiness trend ({sparkData[0].year}–{sparkData[sparkData.length - 1].year})</div>
            <svg width={sparkWidth} height={sparkHeight} viewBox="0 0 {sparkWidth} {sparkHeight}">
              <path d={sparkPath} fill="none" stroke={getRegionColor(country.region)} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .popup-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    backdrop-filter: blur(2px);
  }

  .popup-card {
    background: white;
    border-radius: 16px;
    max-width: 400px;
    width: calc(100% - 40px);
    max-height: 85vh;
    overflow-y: auto;
    box-shadow:
      0 4px 16px rgba(0,0,0,0.12),
      0 16px 48px rgba(0,0,0,0.15);
    position: relative;
    font-family: var(--sans);
    overflow: hidden;
  }

  /* Colored banner */
  .popup-banner {
    padding: 20px 20px 16px;
    position: relative;
    color: white;
  }

  .popup-banner-inner {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .popup-banner h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    font-family: var(--serif);
    color: white;
    line-height: 1.2;
    text-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }

  .popup-region {
    font-size: 12px;
    color: rgba(255,255,255,0.8);
    margin-top: 4px;
  }

  .popup-score-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(255,255,255,0.2);
    border-radius: 10px;
    padding: 8px 14px;
    flex-shrink: 0;
    backdrop-filter: blur(4px);
  }

  .score-num {
    font-size: 22px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    line-height: 1;
    color: white;
  }

  .score-sub {
    font-size: 10px;
    color: rgba(255,255,255,0.75);
    margin-top: 2px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .popup-close {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(255,255,255,0.2);
    border: none;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
  }

  .popup-close:hover {
    background: rgba(255,255,255,0.35);
  }

  /* Content area */
  .popup-content {
    padding: 16px 20px 20px;
    overflow-y: auto;
    max-height: calc(85vh - 100px);
  }

  .popup-rank {
    font-size: 12px;
    color: #888;
    margin-bottom: 14px;
  }

  .popup-rank strong {
    color: #333;
  }

  .sparkline-section {
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid #f0ede8;
  }

  .sparkline-label {
    font-size: 11px;
    font-weight: 600;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 8px;
  }

  .sparkline-section svg {
    display: block;
  }
</style>
