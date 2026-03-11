<script>
  import { getValue } from "$components/helpers/chartUtils.js";

  let { countries, xScale, yScale, xDim, yDim } = $props();

  // Compute a log-style curve for the diminishing returns overlay
  // Only shown when xDim is 'gdp'
  const curvePoints = $derived.by(() => {
    if (xDim !== "gdp") return [];
    const [x0, x1] = xScale.domain();
    const [y0, y1] = yScale.domain();
    const steps = 50;
    const points = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = x0 + t * (x1 - x0);
      // Log-like curve: y = a * ln(x) + b, fitted roughly to the data spread
      const normalized = (x - x0) / (x1 - x0);
      const y = y0 + (y1 - y0) * (0.15 + 0.7 * Math.pow(normalized, 0.45));
      points.push({ x: xScale(x), y: yScale(y) });
    }
    return points;
  });

  const pathD = $derived(
    curvePoints.length > 1
      ? curvePoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")
      : ""
  );
</script>

{#if pathD}
  <path
    d={pathD}
    fill="none"
    stroke="#e15759"
    stroke-width="2"
    stroke-dasharray="6 4"
    opacity="0.6"
    style="pointer-events: none;"
  />
{/if}
