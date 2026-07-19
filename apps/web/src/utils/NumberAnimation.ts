/**
 * 缓动函数集合
 */
export const easingFunctions = {
  // 线性
  linear: (t: number): number => t,

  // 先慢后快
  easeInQuad: (t: number): number => t * t,

  // 先快后慢
  easeOutQuad: (t: number): number => t * (2 - t),

  // 平滑曲线
  easeInOutQuad: (t: number): number =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  // 弹性效果
  easeOutElastic: (t: number): number => {
    const p = 0.3;
    return (
      Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1
    );
  },
} as const;

export type EasingFunctionKey = keyof typeof easingFunctions;
export type EasingFunction = (typeof easingFunctions)[EasingFunctionKey];

export const easingFunctionsOption = Object.keys(easingFunctions).reduce(
  (acc, key) => {
    acc[key as EasingFunctionKey] = key as EasingFunctionKey;
    return acc;
  },
  {} as Record<EasingFunctionKey, EasingFunctionKey>
);

/**
 * 数字动画配置选项
 */
export interface NumberAnimationOptions {
  /** 起始值 */
  start?: number;
  /** 结束值 */
  end: number;
  /** 动画持续时间（毫秒） */
  duration: number;
  /** 缓动函数名称 */
  easing?: EasingFunctionKey;
  /** 动画延迟（毫秒） */
  delay?: number;
  /** 是否四舍五入为整数 */
  roundToInt?: boolean;
  /** 每帧更新的回调 */
  onUpdate: (value: number) => void;
  /** 动画完成时的回调 */
  onComplete?: () => void;
}

export class NumberAnimator {
  private animationFrameId: number | null = null;
  private startTime: number | null = null;
  private isRunning = false;
  private delayTimeoutId: number | null = null;

  /**
   * 验证是否为有效的缓动函数名
   */
  private isValidEasingFunctionName(name: string): name is EasingFunctionKey {
    return name in easingFunctions;
  }

  /**
   * 安全的获取函数，如果名称无效则返回默认值
   */
  private getEasingFunctionSafe(
    name: string,
    defaultName: EasingFunctionKey = 'linear'
  ): EasingFunction {
    if (this.isValidEasingFunctionName(name)) {
      return easingFunctions[name];
    }
    return easingFunctions[defaultName];
  }

  /**
   * 开始动画
   */
  public animate(options: NumberAnimationOptions): void {
    const {
      start = 0,
      end,
      duration,
      easing = easingFunctionsOption.linear,
      delay = 0,
      roundToInt = false,
      onUpdate,
      onComplete,
    } = options;

    this.stop();

    const startAnimation = () => {
      this.isRunning = true;
      this.startTime = performance.now();

      const update = (currentTime: number) => {
        if (!this.isRunning || this.startTime === null) return;

        const elapsed = currentTime - this.startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = this.getEasingFunctionSafe(easing)(progress);
        let currentValue = start + (end - start) * easedProgress;

        if (roundToInt) {
          currentValue = Math.round(currentValue);
        }

        onUpdate(currentValue);

        if (progress < 1) {
          this.animationFrameId = requestAnimationFrame(update);
        } else {
          this.isRunning = false;
          this.startTime = null;
          onComplete?.();
        }
      };
      this.animationFrameId = requestAnimationFrame(update);
    };
    if (delay > 0) {
      this.delayTimeoutId = window.setTimeout(startAnimation, delay);
    } else {
      startAnimation();
    }
  }

  /**
   * 停止动画
   */
  public stop() {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.delayTimeoutId !== null) {
      clearTimeout(this.delayTimeoutId);
      this.delayTimeoutId = null;
    }

    this.startTime = null;
  }

  /**
   * 检查动画是否正在运行
   */
  public isAnimation(): Readonly<boolean> {
    return this.isRunning;
  }

}

/**
 * 根据数值大小动态计算动画时长
 * @param value 目标数值
 * @returns 动画时长（毫秒）
 */
export function getDurationByValue(value: number): number {
  if (value >= 1000000) return 2500;
  if (value >= 100000) return 2000;
  if (value >= 10000) return 1500;
  return 1000;
}

/**
 * 便捷函数：创建并启动一个数字动画
 */
export function animateNumber(options: NumberAnimationOptions): NumberAnimator {
  const animator = new NumberAnimator();
  animator.animate(options);
  return animator;
}
