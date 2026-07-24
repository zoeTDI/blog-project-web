import type { App, Plugin } from 'vue';
import CaMarquee from './src/Marquee.vue';

type WithInstall<T> = T & Plugin;

const withInstall = <T>(comp: T): WithInstall<T> => {
  (comp as WithInstall<T>).install = (app: App) => {
    const name =
      (comp as { name?: string; __name?: string }).name ||
      (comp as { name?: string; __name?: string }).__name ||
      'CaMarquee';
    app.component(name, comp as Parameters<App['component']>[1]);
  };
  return comp as WithInstall<T>;
};

export const CaMarqueeWithInstall = withInstall(CaMarquee);

// 整体导出的 Vue 插件对象 (支持 app.use(CaMarqueePlugin))
export const CaMarqueePlugin: Plugin = {
  install(app: App) {
    app.component('CaMarquee', CaMarquee);
  },
};

export { CaMarquee };
export * from './src/types';
export * from './src/constants';

export default CaMarqueeWithInstall;