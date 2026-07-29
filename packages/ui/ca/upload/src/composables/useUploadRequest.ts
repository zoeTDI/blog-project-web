import { onUnmounted } from 'vue';
import type { CaUploadProps, CaUploadEmits, UploadFile, CustomRequestOptions } from '../types';

export function useUploadRequest(props: CaUploadProps, emits: CaUploadEmits) {
  // 保存当前正在进行中的 XMLHttpRequest 实例映射 (file.id -> XMLHttpRequest)
  const reqsMap = new Map<string, XMLHttpRequest>();

  /**
   * 基于 XMLHttpRequest 的默认网络上传实现
   */
  const defaultRequest = (options: CustomRequestOptions): XMLHttpRequest => {
    const xhr = new XMLHttpRequest();
    const action = options.action;

    // 监听上传进度
    if (xhr.upload) {
      xhr.upload.onprogress = (event: ProgressEvent) => {
        if (event.total > 0) {
          const percent = Math.round((event.loaded / event.total) * 100);
          options.onProgress(percent);
        }
      };
    }

    // 组装 FormData 表单数据
    const formData = new FormData();
    if (options.data) {
      Object.keys(options.data).forEach((key) => {
        formData.append(key, options.data![key]);
      });
    }
    formData.append(options.name || 'file', options.file);

    xhr.onerror = function() {
      options.onError(new Error('Network Error'));
    };

    xhr.onload = function() {
      if (xhr.status < 200 || xhr.status >= 300) {
        return options.onError(
          new Error(`Upload request failed with status ${xhr.status}`),
        );
      }

      let response: any;
      const rawResponse = xhr.responseText || xhr.response;
      try {
        response = JSON.parse(rawResponse);
      } catch {
        response = rawResponse;
      }

      options.onSuccess(response);
    };

    xhr.open('POST', action, true);

    // 设置自定义请求头 Headers
    if (options.headers) {
      Object.keys(options.headers).forEach((key) => {
        xhr.setRequestHeader(key, options.headers![key]);
      });
    }

    xhr.send(formData);
    return xhr;
  };

  /**
   * 触发单个文件的上传操作
   */
  const uploadFile = async (
    fileItem: UploadFile,
    fileList: UploadFile[],
    onUpdateModel: () => void,
  ) => {
    // 若没有指定 action 且没有提供 customRequest，则默认为本地纯展示/选择模式，标记为成功
    if (!props.action && !props.customRequest) {
      fileItem.status = 'success';
      fileItem.percent = 100;
      emits('success', null, fileItem, fileList);
      onUpdateModel();
      return;
    }

    if (!fileItem.raw) return;

    fileItem.status = 'uploading';
    fileItem.percent = 0;

    const options: CustomRequestOptions = {
      file: fileItem.raw,
      action: props.action || '',
      headers: props.headers,
      data: props.data,
      name: props.name || 'file',
      onProgress: (percent: number) => {
        fileItem.percent = percent;
        emits('progress', percent, fileItem);
      },
      onSuccess: (response: any) => {
        fileItem.status = 'success';
        fileItem.percent = 100;
        fileItem.response = response;
        reqsMap.delete(fileItem.id);
        emits('success', response, fileItem, fileList);
        onUpdateModel();
      },
      onError: (error: any) => {
        fileItem.status = 'error';
        fileItem.error = error;
        reqsMap.delete(fileItem.id);
        emits('error', error, fileItem, fileList);
        onUpdateModel();
      },
    };

    // 优先使用自定义上传逻辑，否则退回到默认 XHR 上传
    if (props.customRequest) {
      try {
        await props.customRequest(options);
      } catch (err) {
        options.onError(err);
      }
    } else {
      const xhr = defaultRequest(options);
      reqsMap.set(fileItem.id, xhr);
    }
  };

  /**
   * 中止正在进行的上传请求
   */
  const abort = (file?: UploadFile) => {
    if (file) {
      const xhr = reqsMap.get(file.id);
      if (xhr) {
        xhr.abort();
        reqsMap.delete(file.id);
      }
    } else {
      reqsMap.forEach((xhr) => xhr.abort());
      reqsMap.clear();
    }
  };

  // 组件销毁时中止所有未完成的请求
  onUnmounted(() => {
    abort();
  });

  return {
    uploadFile,
    abort,
  };
}