import MarkdownIt from 'markdown-it';
// @ts-ignore
import container from 'markdown-it-container';
// @ts-ignore
import attrs from 'markdown-it-attrs';
// @ts-ignore
import implicitFigures from 'markdown-it-implicit-figures';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

// 抽取高亮逻辑，方便在自定义 fence 中复用
function getHighlightedCode(str: string, lang: string): string {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(str, {
        language: lang,
        ignoreIllegals: true,
      }).value;
    } catch (__) {}
  }
  return md.utils.escapeHtml(str);
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  // 这里的 highlight 选项在自定义 fence 规则后将作为备用
  highlight: (str, lang) =>
    `<pre><code class="hljs">${getHighlightedCode(str, lang)}</code></pre>`,
});

md.renderer.rules.fence = (tokens, idx) => {
  const token = tokens[idx];
  const code = token.content;
  const lang = token.info.trim() || 'TEXT';

  // 生成高亮内容
  const highlighted = getHighlightedCode(code, lang);

  // 返回自定义结构：
  // 1. .code-block-container 为外层容器
  // 2. .code-lang-tag 用于显示语言并绑定点击事件
  // 3. 将原始代码内容转义后放在 onclick 的参数里，或者后续通过 DOM 获取
  return `
        <div class="code-block-container">
            <div class="code-block-header">
                <!-- 移除了 onclick，改为由 MarkdownRender 代理 -->
                <span class="code-lang-tag" title="点击复制代码">${lang}</span>
            </div>
            <pre><code class="hljs language-${lang}">${highlighted}</code></pre>
            <textarea class="copy-temp" style="display:none">${code}</textarea>
        </div>
    `;
};

// 1. 注册属性插件[cite: 11]
md.use(attrs);
// 2. 注册图片标题插件[cite: 11]
md.use(implicitFigures, {
  figcaption: true,
  copyAttrs: true,
});

md.use(container, 'details', {
  validate: (params: string) => params.trim().match(/^details\s+(.*)$/),
  render: (tokens: any[], idx: number) => {
    const m = tokens[idx].info.trim().match(/^details\s+(.*)$/);
    if (tokens[idx].nesting === 1) {
      return `<details class="custom-callout"><summary>${md.utils.escapeHtml(m[1])}</summary>\n`;
    } else {
      return `</details>\n`;
    }
  },
});

export default md;
