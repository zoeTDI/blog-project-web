import type { App, Plugin } from 'vue';
import CaImage from './src/Image.vue';
import CaImageViewer from './src/Viewer.vue';

type WithInstall<T> = T & Plugin;

const withInstall = <T>(comp: T): WithInstall<T> => {
  (comp as WithInstall<T>).install = (app: App) => {
    const name = (comp as { name?: string; __name?: string }).name
      || (comp as { name?: string; __name?: string }).__name
      || 'CaImage';
    app.component(name, comp as Parameters<App['component']>[1]);
  };
  return comp as WithInstall<T>;
};

export const CaImageWithInstall = withInstall(CaImage);
export const CaImageViewerWithInstall = withInstall(CaImageViewer);

// 整体导出的 Vue 插件对象 (支持 app.use(CaImagePlugin))
export const CaImagePlugin: Plugin = {
  install(app: App) {
    app.component('CaImage', CaImage);
    app.component('CaImageViewer', CaImageViewer);
  },
};

export { CaImage, CaImageViewer };
export * from './src/types.ts';
export default CaImageWithInstall;