<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
  import { customPreferences, preferences } from '@/core/preferences';
  import { getDynamicText } from '@/utils/translate.ts';

  const SITE_NAME_FALLBACK = "BLOG'S TITLE";

  const siteName = computed(
    () =>
      getDynamicText({
        'zh-CN': preferences.app.websiteName_zh_CN,
        'en-US': preferences.app.websiteName_en_US,
      }) || SITE_NAME_FALLBACK
  );

  const siteSlogan = computed(() =>
    getDynamicText({
      'zh-CN': customPreferences.websiteSubName_zh_CN,
      'en-US': customPreferences.websiteSubName_en_US,
    })
  );

  /**
   * 站名逐字入场。
   * 标题过长时压缩总时长，
   * 保证最后一个字在约 1.3s 前开始落下。
   */
  const nameChars = computed(() => {
    const chars = Array.from(siteName.value);
    const step =
      chars.length > 1 ? Math.min(46, 600 / (chars.length - 1)) : 0;

    return chars.map((char, index) => ({
      char: char === ' ' ? '\u00A0' : char,
      delay: 0.7 + (index * step) / 1000,
    }));
  });

  /** 右侧刻度尺 */
  const railTicks = Array.from({ length: 10 }, (_, index) => ({
    top: `${(index / 9) * 100}%`,
    delay: 0.5 + index * 0.036,
  }));

  /** 站名下的细线刻度：同样是 10 格，线画完后逐格点亮 */
  const lineTicks = Array.from({ length: 10 }, (_, index) => ({
    left: `${index * 10}%`,
    delay: 1.36 + index * 0.036,
  }));

  /** 与 CSS 时序对应：2.2s 开始退场，退场 0.58s */
  const HOLD_MS = 2200;
  const EXIT_MS = 580;

  const splashRef = ref<HTMLElement | null>(null);
  const rendered = ref(true);
  const leaving = ref(false);

  let holdTimer: number | undefined;
  let exitTimer: number | undefined;
  let parallaxFrame = 0;
  let pointerX = 0;
  let pointerY = 0;

  /** 点击或任意按键：直接进入退场 */
  const close = () => {
    if (leaving.value) return;
    leaving.value = true;
    /** 通知首页等首屏内容：开屏开始退场，可以接着播放入场动效了 */
    window.dispatchEvent(new CustomEvent('splash:closed'));
    exitTimer = window.setTimeout(() => {
      rendered.value = false;
    }, EXIT_MS);
  };

  const onKeydown = (event: KeyboardEvent) => {
    if (event.repeat) return;
    close();
  };

  /** 幽灵符号的轻微视差：只动装饰层，不影响站名 */
  const applyParallax = () => {
    parallaxFrame = 0;
    const el = splashRef.value;
    if (!el) return;
    el.style.setProperty('--splash-px', pointerX.toFixed(3));
    el.style.setProperty('--splash-py', pointerY.toFixed(3));
  };

  const onPointerMove = (event: PointerEvent) => {
    pointerX = event.clientX / window.innerWidth - 0.5;
    pointerY = event.clientY / window.innerHeight - 0.5;
    if (!parallaxFrame) parallaxFrame = requestAnimationFrame(applyParallax);
  };

  const onPointerLeave = () => {
    pointerX = 0;
    pointerY = 0;
    if (!parallaxFrame) parallaxFrame = requestAnimationFrame(applyParallax);
  };

  onMounted(() => {
    window.addEventListener('keydown', onKeydown);
    holdTimer = window.setTimeout(close, HOLD_MS);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown);
    window.clearTimeout(holdTimer);
    window.clearTimeout(exitTimer);
    if (parallaxFrame) cancelAnimationFrame(parallaxFrame);
  });
</script>

<template>
  <div
    v-if="rendered"
    ref="splashRef"
    :class="['splash', { 'splash--leaving': leaving }]"
    aria-hidden="true"
    @click="close"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave">
    <!-- 背景微光 -->
    <span class="halo"></span>

    <!-- 右侧刻度尺：10 格 -->
    <span class="rail">
      <i
        v-for="(tick, index) in railTicks"
        :key="index"
        :style="{
          top: tick.top,
          animationDelay: `${tick.delay}s`,
        }"></i>
    </span>

    <div class="beat beat--first">
      <span class="beat__mark">
        <span class="beat__letter">C</span><span class="beat__letter">A</span>
      </span>
      <span class="beat__meta">CALDM</span>
    </div>

    <div class="beat beat--second">
      <span class="beat__mark">
        <span class="beat__letter">C</span><span class="beat__letter">A</span>
      </span>
      <span class="beat__meta">CALDM</span>
    </div>

    <div class="splash__core">
      <h1
        class="splash__name"
        :aria-label="siteName">
        <span
          v-for="(item, index) in nameChars"
          :key="index"
          class="char">
          <span
            class="char__inner"
            :style="{ animationDelay: `${item.delay}s` }"
            >{{ item.char }}</span
          >
        </span>
      </h1>

      <span class="splash__rule">
        <i
          v-for="(tick, index) in lineTicks"
          :key="index"
          :style="{
            left: tick.left,
            animationDelay: `${tick.delay}s`,
          }"></i>
      </span>

      <p
        v-if="siteSlogan"
        class="splash__slogan">
        {{ siteSlogan }}
      </p>
    </div>

    <span class="splash__skip">CLICK / ANY KEY TO SKIP</span>
  </div>
</template>

<style scoped>
  .splash {
    --splash-accent: #0ca;
    --splash-mono: ui-monospace, 'Cascadia Code', Consolas, monospace;
    --splash-px: 0;
    --splash-py: 0;

    position: fixed;
    inset: 0;
    z-index: 9000;
    display: grid;
    place-items: center;
    overflow: hidden;
    background: var(--color-root-bg);
    color: var(--color-text-h);
    cursor: pointer;
    transition: transform 0.58s cubic-bezier(0.76, 0, 0.24, 1);
    will-change: transform;
  }

  .splash--leaving {
    transform: translateY(100%);
  }

  /* ---------- 背景微光 ---------- */

  .halo {
    position: absolute;
    width: min(58vw, 860px);
    aspect-ratio: 1;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(0, 204, 170, 0.11) 0%,
      rgba(0, 204, 170, 0.03) 45%,
      transparent 70%
    );
    opacity: 0;
    animation: halo-in 1.1s ease 0.35s both;
    translate: calc(var(--splash-px) * -10px) calc(var(--splash-py) * -10px);
    pointer-events: none;
  }

  @keyframes halo-in {
    from {
      opacity: 0;
      transform: scale(0.82);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* ---------- 右侧刻度尺 ---------- */

  .rail {
    position: absolute;
    top: 18%;
    right: 10%;
    width: 1px;
    height: 56%;
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(0, 204, 170, 0.4),
      transparent
    );
    transform-origin: top center;
    animation: rail-draw 0.7s cubic-bezier(0.65, 0, 0.35, 1) 0.12s both;
    translate: calc(var(--splash-px) * 7px) calc(var(--splash-py) * 7px);
    pointer-events: none;
  }

  .rail i {
    position: absolute;
    left: 0;
    width: 5px;
    height: 1px;
    background: var(--splash-accent);
    opacity: 0;
    animation: rail-tick 0.14s ease both;
  }

  @keyframes rail-draw {
    from {
      transform: scaleY(0);
    }

    to {
      transform: scaleY(1);
    }
  }

  @keyframes rail-tick {
    from {
      opacity: 0;
      transform: translateX(-3px);
    }

    to {
      opacity: 0.55;
      transform: translateX(0);
    }
  }

  .beat {
    position: absolute;
    translate: calc(var(--splash-px) * var(--beat-depth))
      calc(var(--splash-py) * var(--beat-depth));
    pointer-events: none;
  }

  .beat--first {
    --beat-depth: 12px;

    top: 13%;
    left: 6%;
  }

  .beat--second {
    --beat-depth: 22px;

    bottom: 11%;
    left: 23%;
  }

  .beat__mark {
    display: block;
    font-family: var(--font-h);
    font-size: clamp(120px, 15vw, 220px);
    line-height: 0.78;
    letter-spacing: -0.08em;
    color: color-mix(in srgb, var(--color-text-h) 14%, transparent);
  }

  .beat__letter {
    display: inline-block;
    opacity: 0;
    animation: letter-fall 1.1s cubic-bezier(0.33, 0, 0.2, 1) both;
    will-change: transform, opacity, filter;
  }

  .beat--first .beat__letter:nth-child(1) {
    animation-delay: 0.1s;
  }

  .beat--first .beat__letter:nth-child(2) {
    animation-delay: 0.146s;
  }

  .beat--second .beat__letter:nth-child(1) {
    animation-delay: 0.46s;
  }

  .beat--second .beat__letter:nth-child(2) {
    animation-delay: 0.506s;
  }

  .beat__meta {
    display: block;
    margin-top: 12px;
    font-family: var(--splash-mono);
    font-size: 10px;
    letter-spacing: 0.24em;
    color: var(--splash-accent);
    opacity: 0;
    animation: meta-in-out 1s ease both;
  }

  .beat--first .beat__meta {
    animation-delay: 0.16s;
  }

  .beat--second .beat__meta {
    animation-delay: 0.52s;
  }

  @keyframes letter-fall {
    0% {
      opacity: 0;
      filter: blur(8px);
      transform: translateY(-42px) scale(0.92);
    }

    18% {
      opacity: 1;
      filter: blur(0);
      transform: translateY(0) scale(1);
    }

    28% {
      transform: translateY(0) scale(1.04);
    }

    36% {
      transform: translateY(0) scale(1);
    }

    64% {
      opacity: 1;
      filter: blur(0);
      transform: translateY(0) scale(1);
    }

    100% {
      opacity: 0;
      filter: blur(3px);
      transform: translateY(96px) scale(0.98);
    }
  }

  @keyframes meta-in-out {
    0%,
    12% {
      opacity: 0;
      transform: translateY(4px);
    }

    30%,
    70% {
      opacity: 1;
      transform: translateY(0);
    }

    100% {
      opacity: 0;
      transform: translateY(0);
    }
  }

  /* ---------- 站名、细线、副标题 ---------- */

  .splash__core {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 48px;
    text-align: center;
  }

  .splash__name {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0;
    font-family: var(--font-h);
    font-size: clamp(44px, 5.4vw, 84px);
    font-weight: 500;
    line-height: 1.16;
    letter-spacing: -0.03em;
  }

  /* 每个字一个遮罩格：字从上方落入，遮罩避免露出轨迹 */
  .char {
    display: inline-block;
    overflow: hidden;
    padding-top: 0.08em;
    padding-bottom: 0.14em;
    margin-top: -0.08em;
    margin-bottom: -0.14em;
  }

  .char__inner {
    display: inline-block;
    opacity: 0;
    animation: char-drop 0.55s cubic-bezier(0.2, 0.9, 0.25, 1) both;
    will-change: transform, opacity, filter;
  }

  @keyframes char-drop {
    from {
      opacity: 0;
      filter: blur(8px);
      transform: translateY(-110%);
    }

    to {
      opacity: 1;
      filter: blur(0);
      transform: translateY(0);
    }
  }

  .splash__rule {
    position: relative;
    display: block;
    width: clamp(240px, 32vw, 420px);
    height: 1px;
    margin-top: 30px;
    background: var(--splash-accent);
    transform-origin: left center;
    animation: rule-draw 0.36s cubic-bezier(0.65, 0, 0.35, 1) 1s both;
  }

  .splash__rule i {
    position: absolute;
    top: -3px;
    width: 1px;
    height: 7px;
    background: var(--splash-accent);
    opacity: 0;
    animation: line-tick 0.14s ease both;
  }

  @keyframes rule-draw {
    from {
      transform: scaleX(0);
    }

    to {
      transform: scaleX(1);
    }
  }

  @keyframes line-tick {
    from {
      opacity: 0;
      transform: scaleY(0.2);
    }

    to {
      opacity: 0.6;
      transform: scaleY(1);
    }
  }

  .splash__slogan {
    margin-top: 18px;
    font-family: var(--font-text);
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--color-text-primary);
    opacity: 0;
    animation: slogan-in 0.45s ease 1.5s both;
  }

  @keyframes slogan-in {
    from {
      opacity: 0;
      letter-spacing: 0.42em;
      transform: translateY(6px);
    }

    to {
      opacity: 0.7;
      letter-spacing: 0.28em;
      transform: translateY(0);
    }
  }

  .splash__skip {
    position: absolute;
    bottom: 36px;
    left: 50%;
    transform: translateX(-50%);
    font-family: var(--splash-mono);
    font-size: 10px;
    letter-spacing: 0.24em;
    white-space: nowrap;
    color: var(--color-text-primary);
    opacity: 0;
    animation:
      skip-in 0.3s ease 1.2s both,
      skip-pulse 2.4s ease-in-out 1.5s infinite;
  }

  @keyframes skip-in {
    from {
      opacity: 0;
    }

    to {
      opacity: 0.45;
    }
  }

  @keyframes skip-pulse {
    0%,
    100% {
      opacity: 0.45;
    }

    50% {
      opacity: 0.2;
    }
  }

  @media (max-width: 760px) {
    .beat--first {
      top: 10%;
      left: 4%;
    }

    .beat--second {
      bottom: 14%;
      left: 46%;
    }

    .rail {
      right: 6%;
    }

    .splash__core {
      padding: 0 24px;
    }
  }
</style>
