export function createOpacityAnimator(onUpdate) {
  let animationFrame = null;

  function animate(from, to, duration) {
    cancel();
    const startTime = performance.now();

    function tick(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased =
        progress < 0.5
          ? 16 * progress * progress * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 5) / 2;

      const value = from + (to - from) * eased;
      onUpdate(value);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick);
      }
    }

    animationFrame = requestAnimationFrame(tick);
  }

  function cancel() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  }

  return { animate, cancel };
}
