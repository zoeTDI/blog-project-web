import type { SimpleIcon } from 'simple-icons';
import type { FunctionalComponent } from 'vue';
import { h } from 'vue';

export interface SimpleIconOptions {
  /** 是否保持 SimpleIcon 的原生品牌颜色 */
  colored?: boolean;
}

/**
 * 将 SimpleIcon 数据转换为标准的 Vue 函数式组件
 */
export function createSimpleIcon(
  iconData: SimpleIcon,
  options: SimpleIconOptions = {},
): FunctionalComponent {
  const { colored = false } = options;

  const SimpleIconComponent: FunctionalComponent<{ color?: string; class?: any }> = (props) => {
    // 优先使用传入的 color，其次若开启 colored 则使用品牌色，否则默认 currentColor
    const fill = props.color || (colored ? `#${iconData.hex}` : 'currentColor');

    return h(
      'svg',
      {
        role: 'img',
        viewBox: '0 0 24 24',
        xmlns: 'http://www.w3.org/2000/svg',
        fill,
        class: props.class,
        'aria-label': iconData.title,
      },
      [h('path', { d: iconData.path })],
    );
  };

  SimpleIconComponent.displayName = `SimpleIcon_${iconData.slug}`;
  return SimpleIconComponent;
}