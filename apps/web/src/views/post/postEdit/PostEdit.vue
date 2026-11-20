<script setup lang="ts">
import { review } from '@/api';
import { blogPostStatus, blogPostType, type Tag } from '#/blogPost';
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
  _PostDetail,
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

const tags = ref<Tag[]>([]);
const categories = ref<_CategoryNode[]>([]);
const mdEditMode = ref<'code' | 'read' | 'preview'>('code');
const postContextWidth = ref<number>(18);
const slugManuallyModified = ref(false);

const classes = computed(() => {
  const cls: string[] = [ns.b()];
  return cls;
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

const handleSave = () => {
  return runSubmit(async () => {
    await persist();
    CaMessage.success('保存成功');
  });
};

const handleReview = () => {
  return runSubmit(async () => {
    if (!validate()) {
      return;
    }
    const id = await persist();

    try {
      await review({ postId: id });
    } catch {
      CaMessage.warn('内容已保存，提交审核失败，请重试');
      return;
    }
    articleForm.value.status = blogPostStatus.reviewing;
    CaMessage.success('已提交审核');
  });
};

const isNil = (value: unknown): value is null | undefined => value === null || value === undefined;

/**
 * 标题/正文/分类等前置校验
 */
const validate = (): boolean => {
  const form = articleForm.value;

  if (!form.title?.trim()) {
    CaMessage.warn('请输入文章标题');
    return false;
  }

  const requiredFields: Array<[keyof PostEditForm, string]> = [
    ['isTop', '是否置顶'],
    ['isOriginal', '是否原创'],
    ['allowComment', '是否允许评论'],
    ['sortWeight', '排序权重'],
    ['tagIds', '标签'],
    ['categoryIds', '分类'],
  ];

  const missing = requiredFields.find(([key]) => isNil(form[key]));

  if (missing) {
    CaMessage.warn(`${missing[1]}不能为空`);
    return false;
  }

  return true;
};

const persist = async (): Promise<number> => {
  if (articleForm.value.id) {
    await savePost(toSavePostPayload(unref(articleForm)));
    return articleForm.value.id;
  }
  const id = await newPost(toNewPostPayload(unref(articleForm)));
  articleForm.value.id = id;
  return id;
}

const submitting = ref<boolean>(false);

const runSubmit = async (action: () => Promise<void>) => {
  if (submitting.value) {
    return;
  }
  submitting.value = true;
  try {
    await action();
  } catch {
    // 错误提示已由 defHttp 拦截器统一处理
  } finally {
    submitting.value = false;
  }
}

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
  const id = Number(route.params?.id);
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
  <CaCard :class="classes">
    <template #header>
      <div :class="ns.e('title')">
        <input placeholder="请输入标题" v-model="articleForm.title" :class="ns.e('input')" />
      </div>
    </template>
    <template #footer>
      <div :class="ns.e('action-container')">
        <CaButton @click="handleSave" :loading="submitting">
          保存
        </CaButton>
        <CaButton @click="handleReview" :loading="submitting">
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
