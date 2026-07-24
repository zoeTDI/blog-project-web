<script setup lang="ts">
  import { CaRow, CaCol, CaButton } from '@caldm/ui';
  import { ref } from 'vue';
  import { CaImageUpload } from '@/components/ca/caImageUpload';
  import { caMessage } from '@/components/ca/caMessage';
  import {
    ArrowDownRightIcon,
    ArrowUpLeftIcon,
  } from '@heroicons/vue/24/outline';

  const DEFAULT_TEXTAREA_HEIGHT = 130;
  const EXPANDED_TEXTAREA_HEIGHT = 500;

  const uploadRef = ref<InstanceType<typeof CaImageUpload> | null>(null);

  const textareaHeight = ref(DEFAULT_TEXTAREA_HEIGHT);
  const isExpanded = ref(false);
  const uploadedImages = ref<File[]>([]);
  const textareaContent = ref<string>('');

  const toggleExpand = () => {
    isExpanded.value = !isExpanded.value;
    textareaHeight.value = isExpanded.value
      ? EXPANDED_TEXTAREA_HEIGHT
      : DEFAULT_TEXTAREA_HEIGHT;
  };

  const handlePublish = async () => {
    if (uploadedImages.value.length === 0) {
      caMessage.warn('请至少选择一张图片');
      return;
    }
    const formData = new FormData();
    uploadedImages.value.forEach((file) => {
      formData.append('images', file);
    });
    try {
      console.log('正在上传以下文件:', uploadedImages.value);

      // 模拟异步请求延迟
      await new Promise((resolve) => setTimeout(resolve, 1500));

      caMessage.success('发布成功！');
    } catch (error) {
      caMessage.error('上传失败，请重试');
    }
  };
  const handleClear = () => {
    if (uploadRef.value) {
      uploadRef.value.clearFiles();
    }
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
        <ca-button @click="handlePublish">立即发布</ca-button>
        <ca-button
          v-show="uploadedImages.length > 0"
          @click="handleClear"
          >清除图片</ca-button
        >
      </div>
    </div>
    <!--   图片区域 -->
    <div class="image-container">
      <ca-row :gap="10">
        <ca-col :span="24">
          <ca-image-upload
            ref="uploadRef"
            v-model="uploadedImages"
            mode="multiple"
            :max-count="9" />
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
