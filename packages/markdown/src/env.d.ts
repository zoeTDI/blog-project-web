declare module 'markdown-it-implicit-figures' {
  import type { PluginWithOptions } from 'markdown-it';

  export interface ImplicitFiguresOptions {
    /** 是否解析为 <figure data-type="image"> */
    dataType?: boolean;
    /** 是否将 title 或 alt 转化为 <figcaption> */
    figcaption?: boolean | 'title' | 'alt';
    /** 是否复制属性 */
    copyAttrs?: boolean | string;
    /** 是否添加 tabindex */
    tabIndex?: boolean;
    /** 是否将图片包裹在超链接中 */
    link?: boolean;
  }

  const implicitFigures: PluginWithOptions<ImplicitFiguresOptions>;
  export default implicitFigures;
}

declare module 'markdown-it-container' {
  import type { PluginWithOptions } from 'markdown-it';

  export interface ContainerOptions {
    validate?: (params: string) => boolean | RegExpMatchArray | null;
    render?: (tokens: any[], idx: number) => string;
    marker?: string;
  }

  const container: PluginWithOptions<ContainerOptions>;
  export default container;
}

declare module 'markdown-it-attrs' {
  import type { PluginWithOptions } from 'markdown-it';

  const attrs: PluginWithOptions<any>;
  export default attrs;
}