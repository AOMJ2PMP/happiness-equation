<script>
  import { onMount, onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  import ScatterPlot from "$components/chart/ScatterPlot.svelte";
  import Annotation from "$components/chart/Annotation.svelte";
  import IntroText from "$components/story/IntroText.svelte";
  import Tooltip from "$components/ui/Tooltip.svelte";
  import Popup from "$components/ui/Popup.svelte";
  import AxisSelector from "$components/ui/AxisSelector.svelte";
  import RegionFilter from "$components/ui/RegionFilter.svelte";
  import TimeSlider from "$components/ui/TimeSlider.svelte";
  import copy from "$data/copy.json";
  import countries from "$data/countries.json";

  const STORY_LENGTH = copy.story.length;

  // --- STATE ---
  let introStage = $state(0);
  let xDim = $state("gdp");
  let yDim = $state("score2024");
  let highlighted = $state([]);
  let dimmedRegions = $state([]);
  let disabledRegions = $state([]);
  let annotationType = $state("title");
  let selectedYear = $state(null);
  let playing = $state(false);
  let playInterval = $state(null);

  // Tooltip state
  let tooltipCountry = $state(null);
  let tooltipX = $state(0);
  let tooltipY = $state(0);

  // Popup state
  let popupCountry = $state(null);

  const isExploreMode = $derived(introStage >= STORY_LENGTH);

  // --- STORY NAVIGATION ---
  function stepToggle(t) {
    if (introStage + t < 0) {
      introStage = 0;
      applyStep(0);
      return;
    }

    if (t === 2) {
      // Enter explore mode
      introStage = STORY_LENGTH;
      highlighted = [];
      dimmedRegions = [];
      annotationType = null;
      xDim = "gdp";
      yDim = "score2024";
      selectedYear = null;
      return;
    }

    introStage += t;

    if (introStage >= STORY_LENGTH) {
      introStage = STORY_LENGTH;
      highlighted = [];
      dimmedRegions = [];
      annotationType = null;
      return;
    }

    applyStep(introStage);
  }

  function applyStep(idx) {
    const step = copy.story[idx];
    if (!step) return;
    xDim = step.xDim;
    yDim = step.yDim;
    highlighted = step.highlighted || [];
    dimmedRegions = step.dimmedRegions || [];
    annotationType = step.annotation || null;
    selectedYear = null;
  }

  // --- KEYBOARD NAVIGATION ---
  function handleKeydown(e) {
    if (isExploreMode) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      if (introStage < STORY_LENGTH - 1) {
        stepToggle(1);
      } else {
        stepToggle(2);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (introStage > 0) {
        stepToggle(-1);
      }
    }
  }

  onMount(() => {
    window.addEventListener("keydown", handleKeydown);
    applyStep(0);
  });

  onDestroy(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("keydown", handleKeydown);
    }
    stopPlay();
  });

  // --- EXPLORE MODE HANDLERS ---
  function handleChangeX(dim) {
    xDim = dim;
  }

  function handleChangeY(dim) {
    yDim = dim;
  }

  function handleRegionToggle(region) {
    if (disabledRegions.includes(region)) {
      disabledRegions = disabledRegions.filter((r) => r !== region);
    } else {
      disabledRegions = [...disabledRegions, region];
    }
  }

  // --- TIME SLIDER ---
  function handleYearChange(year) {
    selectedYear = year;
  }

  function togglePlay() {
    if (playing) {
      stopPlay();
    } else {
      startPlay();
    }
  }

  function startPlay() {
    playing = true;
    if (selectedYear === null) selectedYear = 2005;
    playInterval = setInterval(() => {
      if (selectedYear >= 2023) {
        stopPlay();
        return;
      }
      selectedYear++;
    }, 400);
  }

  function stopPlay() {
    playing = false;
    if (playInterval) {
      clearInterval(playInterval);
      playInterval = null;
    }
  }

  // --- TOOLTIP & POPUP ---
  function handleHover(country, event) {
    if (country && event) {
      tooltipCountry = country;
      tooltipX = event.clientX;
      tooltipY = event.clientY;
    } else {
      tooltipCountry = null;
    }
  }

  function handleClick(country) {
    popupCountry = country;
  }
</script>

<div class="app-wrapper">
  <div class="chart-area">
    <ScatterPlot
      {countries}
      {xDim}
      {yDim}
      {highlighted}
      {dimmedRegions}
      {disabledRegions}
      {selectedYear}
      onHover={handleHover}
      onClick={handleClick}
    />

    {#if annotationType && !isExploreMode}
      <Annotation type={annotationType} />
    {/if}
  </div>

  {#if isExploreMode}
    <div class="controls-panel" transition:fade>
      <div class="controls-section">
        <AxisSelector {xDim} {yDim} onChangeX={handleChangeX} onChangeY={handleChangeY} />
      </div>
      <div class="controls-section">
        <RegionFilter {disabledRegions} onToggle={handleRegionToggle} />
      </div>
      <div class="controls-section">
        <div class="slider-label">Historical data</div>
        <TimeSlider
          value={selectedYear ?? 2023}
          {playing}
          onChange={handleYearChange}
          onTogglePlay={togglePlay}
        />
        {#if selectedYear}
          <button class="reset-year" onclick={() => { selectedYear = null; stopPlay(); }}>
            Show 2024 data
          </button>
        {/if}
      </div>
    </div>
  {/if}

  <Tooltip country={tooltipCountry} x={tooltipX} y={tooltipY} {xDim} {yDim} />
  <Popup country={popupCountry} onClose={() => popupCountry = null} />

  <IntroText {introStage} onStep={stepToggle} />
</div>

<style>
  .app-wrapper {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    background: var(--color-bg, #fafafa);
    overflow: hidden;
  }

  .chart-area {
    flex: 1;
    position: relative;
    min-height: 0;
  }

  .controls-panel {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 500;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: rgba(255, 253, 250, 0.94);
    backdrop-filter: blur(12px);
    border-radius: 12px;
    padding: 14px;
    box-shadow:
      0 1px 3px rgba(0,0,0,0.05),
      0 4px 16px rgba(0,0,0,0.08);
    border: 1px solid rgba(0,0,0,0.06);
    max-width: 320px;
  }

  .controls-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .slider-label {
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .reset-year {
    font-family: var(--sans);
    font-size: 11px;
    color: #4e79a7;
    background: none;
    border: none;
    padding: 2px 0;
    cursor: pointer;
    text-decoration: underline;
    align-self: flex-start;
  }

  .reset-year:hover {
    color: #3a5f8a;
    background: none;
  }

  @media (max-width: 900px) {
    .controls-panel {
      top: auto;
      bottom: 80px;
      left: 8px;
      right: 8px;
      max-width: none;
      flex-direction: row;
      flex-wrap: wrap;
    }
  }

  @media (max-width: 500px) {
    .controls-panel {
      bottom: 60px;
      padding: 10px;
      gap: 8px;
      flex-direction: column;
    }
  }
</style>
