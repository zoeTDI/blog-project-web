import MarkdownIt from 'markdown-it';
import attrs from 'markdown-it-attrs';
import implicitFigures from 'markdown-it-implicit-figures';

import { registerCalloutPlugin } from './plugins/callout';

import type {
  MarkdownRenderer,
  MarkdownRendererOptions,
} from './types';
import { defaultGetHighlightedCode } from './utils/highlight';

export function createMarkdownRenderer(
  options: MarkdownRendererOptions = {},
): MarkdownRenderer {
  const {
    preset = 'default',
    markdownIt: markdownItOptions = {},
    highlightOptions,
    calloutOptions,
    enableAttrs = true,
    enableImplicitFigures = true,
    plugins = [],
    configure,
  } = options;

  let md: MarkdownIt;

  // 初始化实例
  md = new MarkdownIt(preset, {
    html: true,
    linkify: true,
    typographer: true,
    ...markdownItOptions,
    highlight: (str, lang) => {
      const highlighted = highlightOptions?.getHighlightedCode
        ? highlightOptions.getHighlightedCode(str, lang)
        : defaultGetHighlightedCode(str, lang, md);
      return `<pre><code class="hljs">${highlighted}</code></pre>`;
    },
  });

  // 自定义 Code Block (fence) 规则
  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx];
    const code = token.content;
    const lang = token.info.trim() || 'TEXT';

    const highlighted = highlightOptions?.getHighlightedCode
      ? highlightOptions.getHighlightedCode(code, lang)
      : defaultGetHighlightedCode(code, lang, md);

    return `
      <div class="code-block-container">
          <div class="code-block-header">
              <span class="code-lang-tag" title="点击复制代码">${lang}</span>
          </div>
          <pre><code class="hljs language-${lang}">${highlighted}</code></pre>
          <textarea class="copy-temp" style="display:none">${code}</textarea>
      </div>
    `;
  };

  // 注册插件
  if (enableAttrs) {
    md.use(attrs);
  }

  if (enableImplicitFigures) {
    md.use(implicitFigures, {
      figcaption: true,
      copyAttrs: true,
    });
  }

  // 注册 Callout 容器插件
  registerCalloutPlugin(md, calloutOptions);

  // 注册外部传入插件
  plugins.forEach((pluginItem) => {
    if (Array.isArray(pluginItem)) {
      const [plugin, pOptions] = pluginItem;
      md.use(plugin, pOptions);
    } else {
      md.use(pluginItem);
    }
  });

  // 执行用户自定义配置钩子
  if (configure && typeof configure === 'function') {
    configure(md);
  }

  // 返回 Renderer 实例对象
  const renderer: MarkdownRenderer = {
    md,
    render: (content: string, env = {}) => md.render(content || '', env),
    use: (plugin, ...params) => {
      md.use(plugin, ...params);
      return renderer;
    },
  };

  return renderer;
}