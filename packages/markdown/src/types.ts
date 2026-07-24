import type MarkdownIt from 'markdown-it';
import type { Options, PluginSimple, PluginWithOptions } from 'markdown-it';

export type MarkdownPluginItem =
  | PluginSimple
  | [PluginWithOptions, any];

export interface CalloutOptions {
  /** 是否启用 Callout 扩展，默认 true */
  enable?: boolean;
  /** 自定义 Callout 类型映射，默认支持 note, tip, warning 等 */
  types?: Record<string, string>;
}

export interface HighlightOptions {
  /** 代码高亮方法 */
  getHighlightedCode?: (str: string, lang: string) => string;
}

export interface MarkdownRendererOptions {
  /** markdown-it 预设 */
  preset?: 'default' | 'zero' | 'commonmark';
  /** 原生 markdown-it 配置 */
  markdownIt?: Options;
  /** 代码高亮配置 */
  highlightOptions?: HighlightOptions;
  /** Callout 扩展配置 */
  calloutOptions?: CalloutOptions;
  /** 是否启用 markdown-it-attrs 插件，默认 true */
  enableAttrs?: boolean;
  /** 是否启用 markdown-it-implicit-figures 插件，默认 true */
  enableImplicitFigures?: boolean;
  /** 扩展插件列表 */
  plugins?: MarkdownPluginItem[];
  /** 暴露底层 md 实例供自定义修改 */
  configure?: (md: MarkdownIt) => void;
}

export interface MarkdownRenderer {
  /** 原始 markdown-it 实例 */
  readonly md: MarkdownIt;
  /** 渲染 Markdown 为 HTML 字符串 */
  render: (content: string, env?: Record<string, any>) => string;
  /** 链式注册插件 */
  use: (
    plugin: PluginSimple | PluginWithOptions<any>,
    ...params: any[]
  ) => MarkdownRenderer;
}