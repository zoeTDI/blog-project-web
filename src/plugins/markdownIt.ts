import MarkdownIt from 'markdown-it'
import container from 'markdown-it-container'
import attrs from 'markdown-it-attrs'
import implicitFigures from 'markdown-it-implicit-figures'

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

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
})
// 1. 注册属性插件 (解决图片大小：![alt](url){width=50%})
md.use(attrs);
// 2. 注册图片标题插件 (将 ![alt](url) 转为 figure/figcaption)
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