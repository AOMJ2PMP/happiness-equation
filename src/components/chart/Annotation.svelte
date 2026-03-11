<script>
  let { type = null } = $props();
</script>

{#if type === "title"}
  <!-- Title is handled by IntroText -->
{:else if type === "diminishing"}
  <div class="annotation annotation-diminishing">
    <div class="annotation-callout">
      The curve flattens — each extra dollar of GDP buys less happiness.
    </div>
  </div>
{:else if type === "paradox"}
  <div class="annotation annotation-paradox">
    <div class="annotation-callout">
      Similar happiness, very different wealth.
    </div>
  </div>
{:else if type === "latam"}
  <div class="annotation annotation-latam">
    <div class="annotation-callout">
      Latin America highlighted — strong social bonds compensate for lower GDP.
    </div>
  </div>
{:else if type === "decompose"}
  <div class="annotation annotation-decompose">
    <div class="annotation-callout">
      Hover or click any dot to see the full breakdown.
    </div>
  </div>
{:else if type === "explore-prompt"}
  <div class="annotation annotation-explore">
    <div class="annotation-callout">
      Click "Explore" to unlock all controls.
    </div>
  </div>
{/if}

<style>
  .annotation {
    position: absolute;
    pointer-events: none;
    z-index: 100;
  }

  .annotation-callout {
    background: rgba(255, 253, 250, 0.95);
    backdrop-filter: blur(8px);
    padding: 10px 14px 10px 16px;
    border-radius: 8px;
    font-family: var(--sans);
    font-size: 12px;
    color: #444;
    border: 1px solid rgba(0,0,0,0.07);
    border-left: 3px solid #4e79a7;
    max-width: 240px;
    line-height: 1.5;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  }

  .annotation-diminishing {
    top: 60px;
    right: 40px;
  }

  .annotation-paradox {
    top: 60px;
    right: 40px;
  }

  .annotation-latam {
    top: 60px;
    right: 40px;
  }

  .annotation-decompose {
    top: 60px;
    right: 40px;
  }

  .annotation-explore {
    top: 60px;
    right: 40px;
  }

  @media (max-width: 500px) {
    .annotation-callout {
      font-size: 11px;
      padding: 6px 10px;
    }

    .annotation-diminishing,
    .annotation-paradox,
    .annotation-latam,
    .annotation-decompose,
    .annotation-explore {
      top: 50px;
      right: 12px;
    }
  }
</style>
