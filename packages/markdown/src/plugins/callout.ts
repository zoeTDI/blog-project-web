import type MarkdownIt from 'markdown-it';
// @ts-ignore
import container from 'markdown-it-container';
import { DEFAULT_CALLOUT_TYPES } from '../constants';
import type { CalloutOptions } from '../types';

export function registerCalloutPlugin(
  md: MarkdownIt,
  options?: CalloutOptions
): void {
  if (options?.enable === false) return;

  const calloutTypes = options?.types || DEFAULT_CALLOUT_TYPES;

  Object.values(calloutTypes).forEach((typeName: string) => {
    const pattern = new RegExp(`^${typeName}(?:\\s+(.*))?$`);
    md.use(container, typeName, {
      validate: (params: string) => params.trim().match(pattern),
      render: (tokens: any[], idx: number) => {
        const match = tokens[idx].info.trim().match(pattern);
        if (tokens[idx].nesting === 1) {
          let title: string = '';
          let openAttr: '' | ' open' = ' open';
          if (match && match[1]) {
            title = match[1];
            const firstChar = title.charAt(0);
            if (['-', '+'].includes(firstChar)) {
              title = title.slice(1).trim();
              openAttr = firstChar === '-' ? '' : ' open';
            }
          }
          if (!title || title === '') {
            title = typeName.charAt(0).toUpperCase() + typeName.slice(1);
          }
          return `<details data-callout="${md.utils.escapeHtml(
            typeName
          )}" class="${md.utils.escapeHtml(
            typeName
          )}-callout"${md.utils.escapeHtml(
            openAttr
          )}><summary>${md.utils.escapeHtml(title)}</summary>\n`;
        } else {
          return `</details>\n`;
        }
      },
    });
  });
}