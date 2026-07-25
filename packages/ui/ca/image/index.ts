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

export { CaImage, CaImageViewer };
export * from './src/types.ts';
export default CaImageWithInstall;