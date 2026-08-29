import type { ValueOf } from '@caldm/utils';
import {
  markdownCaptionMode,
  markdownTheme,
} from '@/components/markdownRender/src/constants.ts';

export type MarkdownTheme = ValueOf<typeof markdownTheme>;
export type MarkdownCaptionMode = ValueOf<typeof markdownCaptionMode>;

export interface MarkdownRenderProps {
  content: string;
  theme?: MarkdownTheme;
  captionMode?: MarkdownCaptionMode;
}

export interface MarkdownRenderEmits {
  (e: 'change', valMd: string, valHtml: string): void;
}

export interface MarkdownRenderExpose {
  contentHtml: () => string;
}
