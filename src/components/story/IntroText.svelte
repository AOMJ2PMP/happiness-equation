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
  <button class="backToTour" onclick={() => onStep(-introStage)}>Back to story</button>
{:else}
  <div class="introText">
    {#if currentText}
      <div class="textContent">
        <Text copy={currentText} />
      </div>
    {/if}

    <div class="buttonContainer">
      {#if introStage > 0}
        <button class="prev" class:active={leftPressed} onclick={() => onStep(-1)}>
          <span class="btn-content">
            {#if hasHover}<span class="key-hint">&larr;</span>{/if}
            Back
          </span>
        </button>
      {/if}
      {#if introStage === 0}
        <button class="start" class:active={rightPressed} onclick={() => onStep(1)}>
          <span class="btn-content">
            Start
            {#if hasHover}<span class="key-hint">&rarr;</span>{/if}
          </span>
        </button>
      {:else if introStage < STORY_LENGTH - 1}
        <button class="next" class:active={rightPressed} onclick={() => onStep(1)}>
          <span class="btn-content">
            Next
            {#if hasHover}<span class="key-hint">&rarr;</span>{/if}
          </span>
        </button>
      {:else}
        <button class="explore next" class:active={rightPressed} onclick={() => onStep(2)}>
          <span class="btn-content">
            Explore
            {#if hasHover}<span class="key-hint">&rarr;</span>{/if}
          </span>
        </button>
      {/if}
    </div>
  </div>
  <button class="skipBtn" onclick={() => onStep(2)}>Skip story</button>
{/if}

<style>
  .backToTour,
  .skipBtn {
    position: absolute;
    z-index: 9999;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    padding: 6px 16px;
    font-family: var(--sans);
    font-size: 13px;
    color: #333;
    background: white;
    border: 1px solid #ccc;
    border-bottom: none;
    border-radius: 8px 8px 0 0;
    cursor: pointer;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
    touch-action: manipulation;
  }

  .backToTour:hover,
  .skipBtn:hover {
    background: #f0f0f0;
  }

  .introText {
    position: absolute;
    z-index: 999;
    left: 50%;
    transform: translateX(-50%);
    bottom: 20px;
    width: 380px;
    max-width: calc(100% - 32px);
    padding: 20px 24px;
    font-family: var(--sans);
    color: #222;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .textContent {
    margin-bottom: 12px;
  }

  .introText :global(p) {
    font-size: 14px;
    line-height: 1.6;
    margin: 0 0 10px 0;
  }

  .introText :global(p:last-child) {
    margin-bottom: 0;
  }

  .introText :global(strong) {
    font-weight: 700;
    color: #111;
  }

  .buttonContainer {
    width: 100%;
    height: 38px;
    position: relative;
    margin-top: 12px;
  }

  .introText button {
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 500;
    position: absolute;
    width: calc(50% - 4px);
    color: #333;
    bottom: 0;
    height: 100%;
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: transform 0.1s, box-shadow 0.1s, background 0.2s;
    touch-action: manipulation;
  }

  .introText button:active,
  .introText button.active {
    transform: translateY(1px);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.15);
    background: #e8e8e8;
  }

  .introText button:hover {
    background: #eaeaea;
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
    font-size: 10px;
    font-weight: bold;
    background: rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 3px;
    color: #666;
    opacity: 0.6;
    flex-shrink: 0;
  }

  .introText button:hover .key-hint {
    opacity: 1;
  }

  .introText button.start {
    right: 25%;
    width: 50%;
  }

  .introText button.next {
    right: 0;
  }

  .introText button.prev {
    left: 0;
  }

  @media (max-width: 500px) {
    .introText {
      bottom: 12px;
      width: calc(100% - 24px);
      padding: 16px;
    }
  }
</style>
