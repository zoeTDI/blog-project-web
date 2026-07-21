import { defHttp } from '@/utils/request.ts';

const Api = {
  testHello: '/dev-api/test/hello',
  switchMaster: '/dev-api/test/file/switch-master',
};

export const testHello = () => {
  return defHttp.get(Api.testHello);
};

export const switchMaster = (configId: number) => {
  return defHttp.put(Api.switchMaster, undefined, { params: { configId } });
};
