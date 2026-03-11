<script>
  import Text from "$components/story/Text.svelte";
  import copy from "$data/copy.json";
  import { onMount, onDestroy } from "svelte";

  let { introStage, onStep } = $props();
  const STORY_LENGTH = copy.story.length;
  const isExploreMode = $derived(introStage >= STORY_LENGTH);

  let hasHover = $state(false);
  let leftPressed = $state(false);
  let rightPressed = $state(false);

  function handleKeydown(e) {
    if (isExploreMode) return;
    if (e.key === "ArrowLeft") leftPressed = true;
    if (e.key === "ArrowRight") rightPressed = true;
  }

  function handleKeyup(e) {
    if (e.key === "ArrowLeft") leftPressed = false;
    if (e.key === "ArrowRight") rightPressed = false;
  }

  onMount(() => {
    hasHover = window.matchMedia("(hover: hover)").matches;
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("keyup", handleKeyup);
  });

  onDestroy(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("keyup", handleKeyup);
    }
  });

  const currentText = $derived(
    introStage < STORY_LENGTH ? copy.story[introStage]?.text : ""
  );
</script>

{#if isExploreMode}
  <button class="backToTour" onclick={() => onStep(-introStage)}>← Back to story</button>
{:else}
  <div class="introText">
    {#if currentText}
      <div class="textContent">
        <Text copy={currentText} />
      </div>
    {/if}

    <!-- Step dots -->
    <div class="step-dots">
      {#each copy.story as _, i}
        <span class="dot" class:active={i === introStage}></span>
      {/each}
    </div>

    <div class="buttonContainer">
      {#if introStage > 0}
        <button class="btn btn-prev" class:active={leftPressed} onclick={() => onStep(-1)}>
          <span class="btn-content">
            {#if hasHover}<span class="key-hint">←</span>{/if}
            Back
          </span>
        </button>
      {/if}
      {#if introStage === 0}
        <button class="btn btn-start btn-primary" class:active={rightPressed} onclick={() => onStep(1)}>
          <span class="btn-content">
            Start →
          </span>
        </button>
      {:else if introStage < STORY_LENGTH - 1}
        <button class="btn btn-next btn-primary" class:active={rightPressed} onclick={() => onStep(1)}>
          <span class="btn-content">
            Next
            {#if hasHover}<span class="key-hint">→</span>{/if}
          </span>
        </button>
      {:else}
        <button class="btn btn-next btn-explore" class:active={rightPressed} onclick={() => onStep(2)}>
          <span class="btn-content">
            Explore data
            {#if hasHover}<span class="key-hint">→</span>{/if}
          </span>
        </button>
      {/if}
    </div>
  </div>
  <button class="skipBtn" onclick={() => onStep(2)}>Skip</button>
{/if}

<style>
  .backToTour,
  .skipBtn {
    position: absolute;
    z-index: 9999;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    padding: 5px 18px;
    font-family: var(--sans);
    font-size: 12px;
    font-weight: 500;
    color: #666;
    background: white;
    border: 1px solid #d8d6d0;
    border-bottom: none;
    border-radius: 8px 8px 0 0;
    cursor: pointer;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.06);
    letter-spacing: 0.01em;
    touch-action: manipulation;
  }

  .backToTour:hover,
  .skipBtn:hover {
    background: #f5f4f0;
    color: #333;
  }

  .introText {
    position: absolute;
    z-index: 999;
    left: 50%;
    transform: translateX(-50%);
    bottom: 24px;
    width: 400px;
    max-width: calc(100% - 32px);
    padding: 22px 26px 18px;
    font-family: var(--sans);
    color: #1a1a1a;
    border-radius: 14px;
    background: rgba(255, 253, 250, 0.97);
    border: 1px solid rgba(0,0,0,0.07);
    backdrop-filter: blur(12px);
    box-shadow:
      0 2px 4px rgba(0,0,0,0.04),
      0 8px 24px rgba(0,0,0,0.09),
      0 20px 48px rgba(0,0,0,0.05);
  }

  .textContent {
    margin-bottom: 14px;
  }

  .introText :global(p) {
    font-size: 14px;
    line-height: 1.65;
    margin: 0 0 10px 0;
    color: #2a2a2a;
  }

  .introText :global(p:last-child) {
    margin-bottom: 0;
  }

  .introText :global(strong) {
    font-weight: 700;
    color: #111;
    font-family: var(--serif);
    font-size: 15px;
  }

  /* Step dots */
  .step-dots {
    display: flex;
    gap: 5px;
    margin-bottom: 14px;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #d0cdc8;
    transition: background 0.3s, width 0.3s;
  }

  .dot.active {
    width: 18px;
    border-radius: 3px;
    background: #4e79a7;
  }

  /* Buttons */
  .buttonContainer {
    width: 100%;
    height: 40px;
    position: relative;
  }

  .btn {
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 600;
    position: absolute;
    bottom: 0;
    height: 100%;
    border-radius: 9px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    letter-spacing: 0.01em;
    transition: transform 0.1s, box-shadow 0.1s, background 0.15s;
    touch-action: manipulation;
    border: none;
  }

  .btn-prev {
    left: 0;
    width: calc(38% - 6px);
    background: #eeede9;
    color: #555;
  }

  .btn-prev:hover {
    background: #e5e4df;
    color: #222;
  }

  .btn-next,
  .btn-start {
    right: 0;
  }

  .btn-start {
    left: 31%;
    right: 31%;
    width: auto;
  }

  .btn-primary {
    background: #4e79a7;
    color: white;
    box-shadow: 0 2px 8px rgba(78, 121, 167, 0.35);
    width: calc(62% - 6px);
  }

  .btn-primary:hover {
    background: #3d6490;
    box-shadow: 0 3px 12px rgba(78, 121, 167, 0.45);
  }

  .btn-explore {
    background: linear-gradient(135deg, #4e79a7 0%, #6b9fc4 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(78, 121, 167, 0.35);
    width: calc(62% - 6px);
  }

  .btn-explore:hover {
    background: linear-gradient(135deg, #3d6490 0%, #5a8cb0 100%);
    box-shadow: 0 3px 12px rgba(78, 121, 167, 0.45);
  }

  .btn:active,
  .btn.active {
    transform: translateY(1px);
    box-shadow: none !important;
  }

  .btn-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .key-hint {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    font-size: 11px;
    font-weight: 700;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 4px;
    opacity: 0.75;
    flex-shrink: 0;
  }

  .btn-prev .key-hint {
    background: rgba(0,0,0,0.06);
    border-color: rgba(0,0,0,0.12);
    color: #666;
  }

  .btn:hover .key-hint {
    opacity: 1;
  }

  @media (max-width: 500px) {
    .introText {
      bottom: 12px;
      width: calc(100% - 24px);
      padding: 18px 18px 14px;
    }
  }
</style>
