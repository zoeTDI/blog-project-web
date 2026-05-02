import MarkdownIt from 'markdown-it'
import container from 'markdown-it-container'
import attrs from 'markdown-it-attrs'
import implicitFigures from 'markdown-it-implicit-figures'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css';

function registerTabsPlugin(md: any) {
    md.use(container, 'tabs', {
        render(tokens: any[], idx: number) {
            if (tokens[idx].nesting === 1) {
                // 1. 收集容器内所有的原始文本
                let j = idx + 1;
                let fullRawContent = '';

                // 循环直到找到对应的 close 标签
                while (tokens[j] && (tokens[j].type !== 'container_tabs_close')) {
                    // 只收集 inline 类型的 content，这是实际的文本内容
                    if (tokens[j].type === 'inline') {
                        fullRawContent += tokens[j].content + '\n';
                    }
                    // 如果是代码块等其他块级元素，也需要加上
                    else if (tokens[j].type === 'fence') {
                        fullRawContent += '```' + tokens[j].info + '\n' + tokens[j].content + '```\n';
                    }

                    // 关键：将这些已经被我们手动处理的 token 标记为隐藏
                    // 这样 markdown-it 之后的默认流程就不会再渲染它们了
                    tokens[j].type = 'container_tabs_hidden';
                    tokens[j].content = '';
                    tokens[j].hidden = true;
                    j++;
                }

                // 2. 按照 @tab 分割并渲染
                const tabs = fullRawContent.split('@tab').filter(Boolean);
                const tabsId = `tabs-${Math.random().toString(36).substring(2, 8)}`;

                let headers = '';
                let contents = '';

                tabs.forEach((tabBlock, i) => {
                    const lines = tabBlock.trim().split('\n');
                    const title = lines[0].trim();
                    const bodyText = lines.slice(1).join('\n');

                    // 对内部内容进行递归渲染
                    const bodyHtml = md.render(bodyText);
                    const checked = i === 0 ? 'checked' : '';

                    headers += `
            <input type="radio" id="${tabsId}-${i}" name="${tabsId}" ${checked}>
            <label for="${tabsId}-${i}">${title}</label>`;
                    contents += `<div class="tab-panel">${bodyHtml}</div>`;
                });

                return `<div class="custom-tabs">${headers}<div class="tab-content-wrapper">${contents}</div>`;
            } else {
                // 闭合标签
                return '</div>\n';
            }
        }
    });

    // 注册一个空的规则来处理那些被我们标记为隐藏的 token
    md.renderer.rules.container_tabs_hidden = () => '';
}

// 抽取高亮逻辑，方便在自定义 fence 中复用
function getHighlightedCode(str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
        try {
            return hljs.highlight(str, {
                language: lang,
                ignoreIllegals: true
            }).value;
        } catch (__) { }
    }
    return md.utils.escapeHtml(str);
}

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    // 这里的 highlight 选项在自定义 fence 规则后将作为备用
    highlight: (str, lang) => `<pre><code class="hljs">${getHighlightedCode(str, lang)}</code></pre>`,
})

// --- 自定义代码块 (Fence) 渲染规则 ---
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
    }
})

registerTabsPlugin(md);

export default md;