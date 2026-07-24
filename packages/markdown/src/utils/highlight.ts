import hljs from 'highlight.js';
import type MarkdownIt from 'markdown-it';

export function defaultGetHighlightedCode(
  str: string,
  lang: string,
  md: MarkdownIt
): string {
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