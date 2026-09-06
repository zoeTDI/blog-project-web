<script setup lang="ts">
import { blogPostType, blogPostStatus } from '@/api';
import type { Tag } from '@/api';
import { useCSSNamespace } from '@caldm/hook';
import {
  CaButton,
  CaCard,
  CaCol,
  CaRow,
  CaCheckboxGroup,
  CaCheckbox,
  CaCascader,
  CaSwitch,
  CaTextarea,
  CaMessage,
} from '@caldm/ui';
import { computed, onMounted, ref, unref, watch } from 'vue';
import { isNumber } from '@caldm/utils';
import {
  booleanOptions,
  mdEditModeOptions,
} from '@/views/post/postEdit/constant.ts';
import { resolvePostSlug } from '@/views/post/postEdit/slug.ts';
import { MarkdownRender } from '@/components/markdownRender';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/store/useUserStore.ts';
import {
  getCategories,
  getPost,
  getTags,
  initForm,
  newPost,
  processCategory,
  savePost,
  toNewPostPayload,
  toSavePostPayload,
} from '@/views/post/postEdit/utils.ts';
import type {
  _CategoryNode,
  _NewPostPayload,
  _PostDetail,
  _SavePostPayload,
  PostEditForm,
} from '@/views/post/postEdit/type.ts';

const route = useRoute();
const userStore = useUserStore();
const ns = useCSSNamespace('post-edit');

const articleForm = ref<PostEditForm>({
  id: null as number | null,
  authorId: userStore.getId() as number,
  creator: '',
  updater: '',
  title: '',
  subtitle: '',
  contentMd: '',
  contentHtml: '',
  summary: '',
  type: blogPostType.normal,
  status: blogPostStatus.draft,
  isTop: false,
  isOriginal: true,
  createTime: '',
  updateTime: '',
  publishedTime: '',
  slug: resolvePostSlug('', '', false),
  seoKeywords: '',
  seoDescription: '',
  password: '',
  allowComment: false,
  reprintSource: '',
  sortWeight: 0,
  categoryIds: [] as number[][],
  tagIds: [] as number[],
});

const loading = ref<boolean>(false);
const tags = ref<Tag[]>([]);
const categories = ref<_CategoryNode[]>([]);
const mdEditMode = ref<'code' | 'read' | 'preview'>('code');
const postContextWidth = ref<number>(18);
const slugManuallyModified = ref(false);

const classes = computed(() => {
  const cls: string[] = [ns.b()];
  return cls;
});

const styles = computed(() => {
  return {};
});

const codeWidth = computed(() => {
  if (mdEditMode.value === 'code') {
    return 24;
  } else if (mdEditMode.value === 'read') {
    return 0;
  } else {
    return 12;
  }
})
const readWidth = computed(() => {
  if (mdEditMode.value === 'code') {
    return 0;
  } else if (mdEditMode.value === 'read') {
    return 24;
  } else {
    return 12;
  }
})

const handleSlugInput = () => {
  slugManuallyModified.value = true;
};

const handleSave = async (status: 'draft' | 'publish') => {
  if (loading.value) {
    return;
  }
  loading.value = true;
  try {
    if (articleForm.value.id) {
      const payload: _SavePostPayload = toSavePostPayload(unref(articleForm));
      await savePost(payload);

    } else {
      const payload: _NewPostPayload = toNewPostPayload(unref(articleForm));
      articleForm.value.id = await newPost(payload);
    }
    CaMessage.success('保存成功！');
  } finally {
    loading.value = false;
  }
};

watch(
  () => articleForm.value.isOriginal,
  (newVal) => {
    if (newVal) {
      articleForm.value.reprintSource = '';
    }
  }
);

watch(
  () => articleForm.value.title,
  (title) => {
    if (!slugManuallyModified.value) {
      articleForm.value.slug = resolvePostSlug(title, '', false);
    }
  }
);

onMounted(async () => {
  let id = Number(route.params?.id);
  if (isNumber(id)) {
    const data: _PostDetail = await getPost({ id });
    if (data) {
      articleForm.value = initForm(data);
    }
  }
  Promise.all([getTags(), getCategories()]).then((resolves) => {
    tags.value = resolves[0];
    categories.value = resolves[1].map((node) => processCategory(node));
  });
});
</script>

<template>
  <CaCard :class="classes" :style="styles">
    <template #header>
      <div :class="ns.e('title')">
        <input placeholder="请输入标题" v-model="articleForm.title" :class="ns.e('input')" />
      </div>
    </template>
    <template #footer>
      <div :class="ns.e('action-container')">
        <CaButton @click="handleSave('draft')" :loading="loading">
          保存草稿
        </CaButton>
        <CaButton @click="handleSave('publish')" :loading="loading">
          发布
        </CaButton>
      </div>
    </template>
    <CaRow :class="ns.e('context-container')" :gap="20">
      <CaCol :span="postContextWidth">
        <div :class="ns.e('textarea-container')">
          <CaRow style="height: 100%">
            <CaCol :span="codeWidth">
              <CaTextarea v-model="articleForm.contentMd" :width="'100%'" :height="'100%'" :border="false"
                :class="ns.e('textarea')" />
            </CaCol>
            <CaCol :span="readWidth">
              <MarkdownRender style="width: 100%; height: 100%" :content="articleForm.contentMd" />
            </CaCol>
          </CaRow>
        </div>
      </CaCol>
      <CaCol :span="24 - postContextWidth">
        <div :class="ns.e('meta-container')">
          <CaRow :align="'middle'" justify="center">
            <CaCol :span="12">
              <CaSwitch v-model="mdEditMode" :mode="'full'" :options="mdEditModeOptions"></CaSwitch>
            </CaCol>
          </CaRow>
          <CaRow>
            <CaCol :span="18">是否置顶</CaCol>
            <CaCol :span="6">
              <CaSwitch :options="booleanOptions" v-model="articleForm.isTop">
              </CaSwitch>
            </CaCol>
          </CaRow>
          <CaRow>
            <CaCol :span="18">是否原创</CaCol>
            <CaCol :span="6">
              <CaSwitch :options="booleanOptions" v-model="articleForm.isOriginal">
              </CaSwitch>
            </CaCol>
            <CaCol :span="24" v-show="!articleForm.isOriginal">原链接地址</CaCol>
            <CaCol :span="24" v-show="!articleForm.isOriginal">
              <input v-model="articleForm.reprintSource" />
            </CaCol>
          </CaRow>
          <CaRow>
            <CaCol :span="18">是否允许评论</CaCol>
            <CaCol :span="6">
              <CaSwitch :options="booleanOptions" v-model="articleForm.allowComment" />
            </CaCol>
          </CaRow>
          <CaRow>
            <CaCol :span="24">友好链接</CaCol>
            <CaCol :span="24">
              <input v-model="articleForm.slug" @input="handleSlugInput" />
            </CaCol>
          </CaRow>
          <CaRow>
            <CaCol :span="24">SEO关键字</CaCol>
            <CaCol :span="24">
              <input v-model="articleForm.seoKeywords" />
            </CaCol>
          </CaRow>
          <CaRow>
            <CaCol :span="24">SEO描述</CaCol>
            <CaCol :span="24">
              <textarea v-model="articleForm.seoDescription" />
            </CaCol>
          </CaRow>
          <CaRow>
            <CaCol :span="24">分类</CaCol>
            <CaCol :span="24">
              <CaCascader v-model="articleForm.categoryIds" :options="categories" multiple clearable collapse-tags
                :max-collapse-tags="2" />
            </CaCol>
          </CaRow>
          <CaRow>
            <CaCol :span="24">标签</CaCol>
            <CaCol :span="24">
              <CaCheckboxGroup v-model="articleForm.tagIds">
                <CaCheckbox v-for="tag in tags" :key="tag.id" :label="tag.name" :value="tag.id" />
              </CaCheckboxGroup>
            </CaCol>
          </CaRow>
        </div>
      </CaCol>
    </CaRow>
  </CaCard>
</template>

<style scoped>
.ca-post-edit {
  height: 100%;
}

.ca-post-edit input,
.ca-post-edit textarea {
  width: 100%;
  box-sizing: border-box;
  color: var(--color-text-h);
  background-color: var(--color-bg);
  border: none;
  border-bottom: 1px solid var(--color-border);
  border-radius: 0;
  padding: 8px 12px;
  font-family: var(--font-text);
  font-size: 14px;
  line-height: 1;
  outline: none;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.ca-post-edit input:focus,
.ca-post-edit textarea:focus {
  border-bottom-color: var(--color-accent);
}

.ca-post-edit__title {
  margin-bottom: 4px;
}

.ca-post-edit :deep(.ca-card__header) {
  border-bottom: none;
}

.ca-post-edit__input {
  font-size: 24px;
  font-weight: 600;
  font-family: var(--font-h);
  border: 1px solid transparent;
  background-color: transparent;
  padding: 8px 0;
  border-radius: 0;
}

.ca-post-edit__action-container {
  padding-top: 8px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  column-gap: 8px;
}

.ca-post-edit__context-container {
  width: 100%;
  height: 100%;
  padding: 10px 0;
}

.ca-post-edit__textarea-container {
  height: 100%;
  background-color: var(--color-bg);
  border-radius: 8px;
  padding: 12px;
  border: 1px solid var(--color-border);
}

.ca-post-edit__textarea {
  resize: none;
  background-color: var(--color-bg);
  font-family: var(--md-font-text);
  font-size: 16px;
}

.ca-post-edit__meta-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ca-post-edit__meta-container textarea {
  min-height: 80px;
  resize: vertical;
  border: 1px solid var(--color-border);
  border-radius: 6px;
}

.ca-post-edit__meta-container textarea:focus {
  border-color: var(--color-accent);
}
</style>
