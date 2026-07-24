import { createMarkdownRenderer } from '@caldm/markdown';

export const baseBenderer = createMarkdownRenderer({
  calloutOptions: {
    enable: true,
  },
  // 可在此传入自定义插件或configure钩子
  // configure: (md) => {},
});