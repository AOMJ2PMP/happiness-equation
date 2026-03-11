<script>
  import { onMount } from "svelte";
  import Axes from "$components/chart/Axes.svelte";
  import {
    createScale,
    createRadiusScale,
    getRegionColor,
    getValue,
    getHistoricalValue,
  } from "$components/helpers/chartUtils.js";
  import { hasValidData, matchesFilters } from "$components/helpers/dataUtils.js";

  let {
    countries,
    xDim = "gdp",
    yDim = "score2024",
    highlighted = [],
    dimmedRegions = [],
    disabledRegions = [],
    selectedYear = null,
    onHover = () => {},
    onClick = () => {},
  } = $props();

  let containerEl;
  let width = $state(800);
  let height = $state(600);

  const margin = { top: 40, right: 30, bottom: 50, left: 60 };

  // Scales — recompute when dimensions or data change
  const xScale = $derived(createScale(countries, xDim, [margin.left, width - margin.right], selectedYear));
  const yScale = $derived(createScale(countries, yDim, [height - margin.bottom, margin.top], selectedYear));
  const rScale = $derived(createRadiusScale(countries));

  // Resize observer
  onMount(() => {
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
      }
    });
    ro.observe(containerEl);
    return () => ro.disconnect();
  });

  function getX(country) {
    const val = selectedYear
      ? getHistoricalValue(country, xDim, selectedYear)
      : getValue(country, xDim);
    return val !== null && val !== undefined ? xScale(val) : null;
  }

  function getY(country) {
    const val = selectedYear
      ? getHistoricalValue(country, yDim, selectedYear)
      : getValue(country, yDim);
    return val !== null && val !== undefined ? yScale(val) : null;
  }

  function getOpacity(country) {
    if (disabledRegions.includes(country.region)) return 0.05;
    if (!hasValidData(country, xDim, yDim, selectedYear)) return 0;
    if (!matchesFilters(country, { dimmedRegions, highlighted })) return 0.08;
    return 1;
  }

  function isHighlighted(country) {
    return highlighted.length > 0 && highlighted.includes(country.name);
  }
</script>

<div class="scatter-container" bind:this={containerEl}>
  <svg {width} {height} viewBox="0 0 {width} {height}">
    <defs>
      <filter id="hl-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <Axes {xScale} {yScale} {xDim} {yDim} {width} {height} {margin} />

    {#each countries as country (country.name)}
      {@const x = getX(country)}
      {@const y = getY(country)}
      {@const opacity = getOpacity(country)}
      {@const r = rScale(country.score2024 ?? 5)}
      {@const hl = isHighlighted(country)}
      {#if x !== null && y !== null}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <circle
          cx="0"
          cy="0"
          {r}
          fill={getRegionColor(country.region)}
          {opacity}
          stroke={hl ? "#fff" : "rgba(255,255,255,0.55)"}
          stroke-width={hl ? 2 : 1}
          filter={hl ? "url(#hl-glow)" : "none"}
          style="transform: translate({x}px, {y}px); transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease;"
          role="img"
          aria-label="{country.name}: {country.score2024}"
          tabindex="0"
          onmouseenter={(e) => onHover(country, e)}
          onmouseleave={() => onHover(null)}
          onclick={() => onClick(country)}
          onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(country); }}
        />
      {/if}
    {/each}

    <!-- Country labels for highlighted dots -->
    {#each countries as country (country.name)}
      {@const x = getX(country)}
      {@const y = getY(country)}
      {#if x !== null && y !== null && isHighlighted(country)}
        <!-- Label background pill -->
        <rect
          x={x - 32}
          y={y - rScale(country.score2024 ?? 5) - 24}
          width="64"
          height="17"
          rx="8"
          fill="white"
          fill-opacity="0.9"
          style="pointer-events: none;"
        />
        <text
          x={x}
          y={y - rScale(country.score2024 ?? 5) - 11}
          text-anchor="middle"
          fill="#1a1a1a"
          font-size="11"
          font-weight="700"
          font-family="var(--sans)"
          style="transition: all 600ms cubic-bezier(0.22, 1, 0.36, 1); pointer-events: none;"
        >
          {country.name}
        </text>
      {/if}
    {/each}
  </svg>
</div>

<style>
  .scatter-container {
    width: 100%;
    height: 100%;
    position: relative;
  }

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  circle {
    cursor: pointer;
  }

  circle:hover {
    stroke: #333;
    stroke-width: 1.5;
  }

  @media (prefers-reduced-motion: reduce) {
    circle {
      transition: none !important;
    }
  }
</style>
