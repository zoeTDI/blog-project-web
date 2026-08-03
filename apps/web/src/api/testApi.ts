import { defHttp } from '@/utils/request.ts';

const Api = {
  testHello: '/dev-api/test/hello',
  switchMaster: '/dev-api/test/file/switch-master',
  uploadFile: '/dev-api/test/file/upload',
  getUserInfo: '/secure/getUserInfo',
};

export const testHello = () => {
  return defHttp.get(Api.testHello);
};

export const switchMaster = (configId: number) => {
  return defHttp.put(Api.switchMaster, undefined, { params: { configId } });
};

export interface FileUploadVo {
  path: string;
  url: string;
}

export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return defHttp.post<FileUploadVo>(Api.uploadFile, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getUserInfo = () => {
  return defHttp.post(Api.getUserInfo, null, { withCredentials: true, });
};
