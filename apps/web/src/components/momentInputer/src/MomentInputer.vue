<script setup lang="ts">
  import { CaRow, CaCol, CaButton, CaMessage, CaUpload } from '@caldm/ui';
  import type { UploadFile, CustomRequestOptions } from '@caldm/ui';
  import { ref } from 'vue';
  import {
    ArrowDownRightIcon,
    ArrowUpLeftIcon,
  } from '@heroicons/vue/24/outline';
  import { type FileUploadVo, uploadFile } from '@/api/testApi.ts';

  const DEFAULT_TEXTAREA_HEIGHT = 130;
  const EXPANDED_TEXTAREA_HEIGHT = 500;

  const uploadRef = ref<InstanceType<typeof CaUpload> | null>(null);

  const textareaHeight = ref(DEFAULT_TEXTAREA_HEIGHT);
  const isExpanded = ref(false);
  const isPublishing = ref(false);
  const imageFiles = ref<UploadFile[]>([]);
  const textareaContent = ref<string>('');

  const toggleExpand = () => {
    isExpanded.value = !isExpanded.value;
    textareaHeight.value = isExpanded.value
      ? EXPANDED_TEXTAREA_HEIGHT
      : DEFAULT_TEXTAREA_HEIGHT;
  };

  const handleCustomUpload = async (options: CustomRequestOptions) => {
    try {
      const res = await uploadFile(options.file);
      options.onSuccess(res);
    } catch (error) {
      options.onError(error instanceof Error ? error : new Error('上传失败'));
    }
  };

  const handlePublish = async () => {
    if (!textareaContent.value.trim() && imageFiles.value.length === 0) {
      CaMessage.warn('请输入内容或选择图片');
      return;
    }

    isPublishing.value = true;

    try {
      if (imageFiles.value.length > 0) {
        await executeUploadProcess();
      }

      const uploadedResults = imageFiles.value
        .filter((f) => f.status === 'success' && f.response)
        .map((f) => f.response as FileUploadVo);

      const payload = {
        content: textareaContent.value,
        images: uploadedResults.map((item) => item.path),
      };

      console.log('提交发布的数据:', payload);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      CaMessage.success('发布成功！');
      textareaContent.value = '';
      handleClear();
    } catch (error) {
      CaMessage.error('发布失败，请重试');
    } finally {
      isPublishing.value = false;
    }
  };

  /**
   * 辅助方法：手动触发上传并等待上传完成的 Promise
   */
  const executeUploadProcess = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // 获取尚未上传成功的文件[cite: 4]
      const pendingFiles = imageFiles.value.filter(
        (f) => f.status !== 'success'
      );

      // 若所有文件均已上传成功，直接通过
      if (pendingFiles.length === 0) {
        resolve();
        return;
      }

      // 驱动 CaUpload 逐个触发 customRequest[cite: 4, 6]
      uploadRef.value?.submit();

      // 简单的状态轮询：检测 imageFiles 中未完成的文件状态
      const checkInterval = setInterval(() => {
        const hasError = imageFiles.value.some((f) => f.status === 'error');
        if (hasError) {
          clearInterval(checkInterval);
          reject(new Error('部分图片上传失败，请重试'));
          return;
        }

        const allFinished = imageFiles.value.every(
          (f) => f.status === 'success'
        );
        if (allFinished) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 200);
    });
  };

  /**
   * 清空上传图片
   */
  const handleClear = () => {
    uploadRef.value?.clearFiles();
  };

  /**
   * 处理上传图片超过限制
   */
  const handleExceed = () => {
    CaMessage.warn('上传图片数量超过限制');
  };
</script>

<template>
  <div class="moment-inputer">
    <!--   输入区域 -->
    <div class="input-container">
      <div class="textarea-container">
        <textarea
          ref="textareaRef"
          class="moment-textarea"
          :style="{ height: textareaHeight + 'px' }"
          v-model="textareaContent"
          placeholder="分享新鲜事...">
        </textarea>
        <div
          class="toggle-icon"
          @click="toggleExpand">
          <component :is="isExpanded ? ArrowUpLeftIcon : ArrowDownRightIcon" />
        </div>
      </div>
      <div class="action-container">
        <ca-button
          @click="handlePublish"
          :loading="isPublishing"
          >立即发布</ca-button
        >
        <ca-button
          v-show="imageFiles.length > 0"
          @click="handleClear"
          :disabled="isPublishing"
          >清除图片</ca-button
        >
      </div>
    </div>
    <!--   图片区域 -->
    <div class="image-container">
      <ca-row :gap="10">
        <ca-col :span="24">
          <CaUpload
            multiple
            drag
            ref="uploadRef"
            v-model="imageFiles"
            list-type="picture-card"
            accept="image/*"
            :max-count="1"
            :auto-upload="false"
            :custom-request="handleCustomUpload"
            @exceed="handleExceed" />
        </ca-col>
      </ca-row>
    </div>
  </div>
</template>

<style scoped>
  .image-container {
    margin-top: 10px;
    min-height: 100px;
  }

  .moment-inputer {
    width: 100%;
    background-color: var(--color-container-bg);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 20px;
    transition: all 0.3s ease;
  }

  .input-container {
    display: flex;
    justify-content: flex-start;
    gap: 20px;
  }

  .textarea-container {
    flex: 1 1 auto;
    position: relative;
  }

  .moment-textarea {
    width: 100%;
    padding: 12px;
    box-sizing: border-box;
    resize: none;
    outline: none;

    background-color: var(--color-context-bg);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    color: var(--color-text-primary);
    font-family: var(--font-text);
    font-size: 16px;

    transition: height 0.3s ease;
  }

  .moment-textarea::placeholder {
    color: var(--color-text-primary);
    opacity: 0.5;
  }

  .moment-textarea:focus {
    background-color: var(--color-container-bg);
    border-color: var(--color-border-accent);
    box-shadow: 0 0 0 3px var(--color-bg-hover-accent);
  }

  textarea {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  textarea::-webkit-scrollbar {
    scrollbar-width: none;
  }

  .action-container {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .toggle-icon {
    position: absolute;
    right: 5px;
    bottom: 15px;
    width: 14px;
    height: 14px;
    cursor: pointer;
    color: var(--color-text-primary);
    opacity: 0.6;
    transition: opacity 0.2s;
  }
  .toggle-icon:hover {
    opacity: 1;
  }

  .image-container {
    margin-top: 5px;
  }
</style>
