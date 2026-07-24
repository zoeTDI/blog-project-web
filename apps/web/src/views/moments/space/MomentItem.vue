<script setup lang="ts">
  import { CaRow, CaCol, CaAvatar } from '@caldm/ui';
  import { CaImage } from '@/components/ca/caImage';
  import { MarkdownRender } from '@/components/markdownRender';
  import { computed, ref } from 'vue';
  import { caMessage } from '@/components/ca/caMessage';

  export interface MomentItemData {
    id: string | number;
    avatarUrl?: string;
    authorName?: string;
    content: string;
    imageList?: any[];
    meta: {
      viewCount: number;
      likeCount: number;
      commentCount: number;
    };
  }

  const props = withDefaults(
    defineProps<{
      data: MomentItemData;
      maxImages?: number;
      maxWords?: number;
      maxLines?: number;
    }>(),
    {
      maxImages: 9,
      maxWords: 200,
      maxLines: 7,
    }
  );

  const isExpend = ref<boolean>(false);

  const showExpendBtn = computed(() => {
    return (
      props.data.content.length > props.maxWords ||
      countConsecutiveNewlines(props.data.content) > props.maxLines
    );
  });

  function countConsecutiveNewlines(text: string): number {
    const matches = text.match(/\n{2,}/g);
    return matches ? matches.length : 0;
  }

  const handleExpend = () => {
    isExpend.value = !isExpend.value;
  };

  const handleImageLayout = (index: number): number => {
    if (
      !Array.isArray(props.data.imageList) ||
      props.data.imageList.length === 0
    ) {
      return 0;
    }
    let rs: number;
    switch (props.data.imageList.length) {
      case 1: {
        rs = 20;
        break;
      }
      case 2:
      case 4: {
        rs = 10;
        break;
      }
      case 3:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9: {
        rs = 8;
        break;
      }
      default: {
        rs = 8;
        break;
      }
    }
    return rs;
  };

  const getImageList = () => {
    if (!Array.isArray(props.data.imageList)) {
      return [];
    }
    if (props.data.imageList.length > props.maxImages) {
      let imageList = [...props.data.imageList];
      return imageList.slice(0, props.maxImages);
    }
    return [...props.data.imageList];
  };

  const getContent = (): string => {
    if (isExpend.value) return props.data.content;
    const newlineCount = countConsecutiveNewlines(props.data.content);
    if (newlineCount > props.maxLines) {
      const parts = props.data.content.split(/\n{2,}/);
      return parts.slice(0, props.maxLines).join('\n\n') + '...';
    }
    if (props.data.content.length > props.maxWords) {
      return props.data.content.slice(0, props.maxWords) + '...';
    }
    return props.data.content;
  };

  const addLike = () => {
    setTimeout(() => {
      caMessage.success('🎉🎉🎉点赞成功');
    }, 500);
  };
</script>

<template>
  <div
    class="moment-item"
    v-if="data">
    <div class="moment-item__container">
      <ca-row :gap="16">
        <ca-col :span="4">
          <ca-row :gap="12">
            <ca-col :span="24">
              <ca-avatar :url="data.avatarUrl || ''" />
            </ca-col>
            <ca-col
              :span="24"
              v-if="data.authorName">
              {{ data.authorName }}
            </ca-col>
          </ca-row>
        </ca-col>
        <ca-col :span="20">
          <ca-row :gap="16">
            <ca-col :span="24">
              <div
                class="content__container"
                :class="{ 'is-expend': isExpend }">
                <markdown-render :content="getContent()" />
                <button
                  v-if="showExpendBtn"
                  class="expand-btn"
                  @click="handleExpend">
                  展开
                </button>
              </div>
            </ca-col>
            <ca-col :span="21">
              <ca-row
                :gap="12"
                v-if="
                  Array.isArray(data.imageList) && data.imageList.length > 0
                ">
                <ca-col
                  v-for="(item, index) in getImageList()"
                  :key="item.id"
                  :span="handleImageLayout(index)">
                  <ca-image
                    :src="item.url"
                    class="img" />
                </ca-col>
              </ca-row>
            </ca-col>
          </ca-row>
        </ca-col>
      </ca-row>
      <ca-row :gap="20">
        <ca-col
          :offset="10"
          :span="4">
          <div class="metadata-item">
            👁 VIEWS {{ data.meta.viewCount || 0 }}
          </div>
        </ca-col>
        <ca-col :span="5">
          <div class="metadata-item">
            💬 COMMENTS {{ data.meta.commentCount || 0 }}
          </div>
        </ca-col>

        <ca-col :span="4">
          <div
            class="metadata-item action-item"
            @click="addLike">
            ♥ LIKES {{ data.meta.likeCount || 0 }}
          </div>
        </ca-col>
      </ca-row>
    </div>
  </div>
</template>

<style scoped>
  .moment-item {
    margin: 20px auto;
    padding: 10px;
    background-color: var(--color-bg);
  }

  .moment-item__container {
    padding: 24px 0;
  }

  .content__container {
    position: relative;
    padding-bottom: 24px;
  }

  .content__container .expand-btn {
    position: absolute;
    bottom: 0;
    right: 10px;
    background-color: var(--color-bg);
    color: var(--color-text-primary);
    border: unset;
    outline: unset;
    will-change: color;
    transition: color 150ms ease;
    cursor: pointer;
  }

  .content__container .expand-btn:hover {
    color: var(--color-accent);
  }

  .img {
    width: 100%;
  }

  .metadata-item {
    margin-top: 10px;
    font-size: 12px;
    user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
  }

  .action-item {
    will-change: color;
    transition: color 150ms ease;
    cursor: pointer;
  }

  .action-item:hover {
    color: var(--color-accent);
  }
</style>
