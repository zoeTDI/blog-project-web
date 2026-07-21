import type { Router } from 'vue-router';
import { createHttp } from '@caldm/request';

const handleUnauthorized = async () => {
  const router = (await import('@/router')).default as unknown as Router;
  router.push({ name: 'Login' });
};

export const defHttp = createHttp({
  baseURL: 'http://localhost:18080/api',
  timeout: 10000,
  onErrorMessage: (msg) => {
    console.error(msg);
  },
  onUnauthorized: handleUnauthorized,
});