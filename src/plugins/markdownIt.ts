import MarkdownIt from 'markdown-it'
import container from 'markdown-it-container'
import attrs from 'markdown-it-attrs'
import implicitFigures from 'markdown-it-implicit-figures'

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
})

md.use(attrs);

md.use(implicitFigures, {
    figcaption: true,
    copyAttrs: true,
});

md.use(container, 'details', {
    validate: (params: string) => params.trim().match(/^details\s+(.*)$/),
    render: (tokens: any[], idx: number) => {
        const m = otkens[idx].info.trim().match(/^details\s+(.*)$/);
        if (tokens[idx].nesting === 1) {
            return `<details class="custom-callout"><summary>${md.utils.escapeHtml(m[1])}</summary>\n`;
        } else {
            return `</details>\n`;
        }
    }
})

md.use(container, 'tabs', {
    render: (tokens: any[], idx: number) => {
        return tokens[idx].nesting === 1
            ? `<div class="custom-tabs">`
            : `</div>`;
    }
})

export default md;