import type { App, Plugin } from 'vue';

import CaFileIcon from './src/components/FileIcon.vue';
import CaUploadProgress from './src/components/UploadProgress.vue';
import CaUploadItemCard from './src/items/UploadItemCard.vue';
import CaUploadItemText from './src/items/UploadItemText.vue';
import CaUpload from './src/Upload.vue';
import CaUploadList from './src/UploadList.vue';


export {
  CaFileIcon,
  CaUploadProgress,
  CaUploadItemCard,
  CaUploadItemText,
  CaUpload,
  CaUploadList,
};
export * from './helper.ts';
export * from './src/composables/useUploader.ts';
export * from './src/composables/useUploadRequest.ts';
export * from './src/types.ts';

export type SFCWithInstall<T> = T & Plugin;

export const CaUploadWithInstall = CaUpload as SFCWithInstall<typeof CaUpload>;

CaUploadWithInstall.install = (app: App): void => {
  app.component('CaUpload', CaUpload);
};

export default CaUploadWithInstall;