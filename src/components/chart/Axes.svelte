<script>
  import { getTicks, formatTick, DIMENSIONS } from "$components/helpers/chartUtils.js";

  let { xScale, yScale, xDim, yDim, width, height, margin } = $props();

  const xTicks = $derived(getTicks(xScale, 6));
  const yTicks = $derived(getTicks(yScale, 6));
  const xLabel = $derived(DIMENSIONS[xDim]?.label || xDim);
  const yLabel = $derived(DIMENSIONS[yDim]?.label || yDim);
</script>

<g class="axes">
  <!-- X axis -->
  <g class="x-axis">
    {#each xTicks as tick}
      {@const x = xScale(tick)}
      <line
        x1={x}
        y1={margin.top}
        x2={x}
        y2={height - margin.bottom}
        stroke="#e0e0e0"
        stroke-width="1"
      />
      <text
        x={x}
        y={height - margin.bottom + 20}
        text-anchor="middle"
        fill="#666"
        font-size="11"
        font-family="var(--sans)"
      >
        {formatTick(tick, xDim)}
      </text>
    {/each}
    <text
      x={(margin.left + width - margin.right) / 2}
      y={height - 6}
      text-anchor="middle"
      fill="#333"
      font-size="13"
      font-weight="500"
      font-family="var(--sans)"
    >
      {xLabel}
    </text>
  </g>

  <!-- Y axis -->
  <g class="y-axis">
    {#each yTicks as tick}
      {@const y = yScale(tick)}
      <line
        x1={margin.left}
        y1={y}
        x2={width - margin.right}
        y2={y}
        stroke="#e0e0e0"
        stroke-width="1"
      />
      <text
        x={margin.left - 8}
        y={y + 4}
        text-anchor="end"
        fill="#666"
        font-size="11"
        font-family="var(--sans)"
      >
        {formatTick(tick, yDim)}
      </text>
    {/each}
    <text
      x={14}
      y={(margin.top + height - margin.bottom) / 2}
      text-anchor="middle"
      fill="#333"
      font-size="13"
      font-weight="500"
      font-family="var(--sans)"
      transform="rotate(-90, 14, {(margin.top + height - margin.bottom) / 2})"
    >
      {yLabel}
    </text>
  </g>

  <!-- Axis lines -->
  <line
    x1={margin.left}
    y1={height - margin.bottom}
    x2={width - margin.right}
    y2={height - margin.bottom}
    stroke="#999"
    stroke-width="1"
  />
  <line
    x1={margin.left}
    y1={margin.top}
    x2={margin.left}
    y2={height - margin.bottom}
    stroke="#999"
    stroke-width="1"
  />
</g>
