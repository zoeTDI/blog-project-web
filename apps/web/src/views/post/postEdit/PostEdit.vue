<script setup lang="ts">
  import type { Tag, BlogPostCreatePayload } from '@/api';
  import {
    addBlogPost,
    getPostById,
  } from '@/api';
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
  } from '@caldm/ui';
  import { computed, onMounted, ref, watch } from 'vue';
  import { isNumber } from '@caldm/utils';
  import {
    booleanOptions,
    mdEditModeOptions,
  } from '@/views/post/postEdit/constant.ts';
  import { normalizeCategoryTrees } from '@/views/post/postEdit/category.ts';
  import { resolvePostSlug } from '@/views/post/postEdit/slug.ts';
  import { MarkdownRender } from '@/components/markdownRender';
  import { useRoute } from 'vue-router';
  import { useUserStore } from '@/store/useUserStore.ts';
  import {
    getCategories,
    getTags,
    processCategory,
  } from '@/views/post/postEdit/utils.ts';
  import type { _CategoryNode } from '@/views/post/postEdit/type.ts';

  const route = useRoute();
  const userStore = useUserStore();
  const ns = useCSSNamespace('post-edit');

  const articleForm = ref({
    id: null as number | null,
    authorId: userStore.getId(),
    creator: '',
    updater: '',
    title: '',
    subtitle: '',
    contentMd: '',
    contentHtml: '',
    summary: '',
    type: 1,
    status: 0,
    isTop: 'false',
    isOriginal: 'true',
    createTime: '',
    updateTime: '',
    publishedTime: null,
    slug: resolvePostSlug('', '', false),
    seoKeywords: '',
    seoDescription: '',
    password: null,
    allowComment: 'false',
    reprintSource: null,
    sortWeight: 0,
    category: [] as number[][],
    tags: [] as number[],
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

  const handleSlugInput = () => {
    slugManuallyModified.value = true;
  };

  const handleSave = async (status: 'draft' | 'publish') => {
    if (loading.value) {
      return;
    }
    loading.value = true;
    try {
      const payload: BlogPostCreatePayload = {
        title: articleForm.value.title,
        isTop: articleForm.value.isTop === 'true',
        isOriginal: articleForm.value.isOriginal === 'true',
        allowComment: articleForm.value.allowComment === 'true',
        sortWeight: 0,
        subtitle: articleForm.value.subtitle,
        contentMd: articleForm.value.contentMd,
        contentHtml: articleForm.value.contentHtml,
        summary: articleForm.value.summary,
        type: 1, // 普通文章
        status: status === 'publish' ? 2 : 0, // 草稿状态
        publishedTime: '',
        slug: articleForm.value.slug,
        seoKeywords: articleForm.value.seoKeywords,
        seoDescription: articleForm.value.seoDescription,
        password: articleForm.value.password,
        reprintSource: articleForm.value.reprintSource,
        tagIds: articleForm.value.tags,
        categoryTrees: normalizeCategoryTrees(articleForm.value.category),
      };
      console.log(
        '🚀 ~ handleSave ~ JSON.stringify(payload, null, 2): ',
        JSON.stringify(payload, null, 2)
      );
      await addBlogPost(payload);
    } finally {
      loading.value = false;
    }
  };

  watch(
    () => articleForm.value.isOriginal,
    (newVal) => {
      if (newVal === 'true') {
        articleForm.value.reprintSource = null;
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
      const data = await getPostById({ id });
      if (data) {
        articleForm.value.id = data.id;
        articleForm.value.authorId = data.authorId;
        articleForm.value.creator = data.creator;
        articleForm.value.updater = data.updater;
        articleForm.value.title = data.title;
        articleForm.value.subtitle = data.subtitle;
        articleForm.value.contentMd = data.contentMd;
        articleForm.value.contentHtml = data.contentHtml;
        articleForm.value.summary = data.summary;
        articleForm.value.tags = data.tags || [];
        articleForm.value.category = data.categories || [];
        articleForm.value.type = data.type;
        articleForm.value.status = data.status;
        articleForm.value.isTop = data.isTop;
        articleForm.value.isOriginal = data.isOriginal;
        articleForm.value.createTime = data.createTime;
        articleForm.value.updateTime = data.updateTime;
        articleForm.value.publishedTime = data.publishedTime;
        articleForm.value.slug = data.slug;
        articleForm.value.seoKeywords = data.seoKeywords;
        articleForm.value.seoDescription = data.seoDescription;
        articleForm.value.password = data.password;
        articleForm.value.allowComment = data.allowComment;
        articleForm.value.reprintSource = data.reprintSource;
        articleForm.value.sortWeight = data.sortWeight;
      }
    }
    Promise.all([getTags(), getCategories()]).then((resolves) => {
      tags.value = resolves[0];
      categories.value = resolves[1].map((node) => processCategory(node));
    });
  });
</script>

<template>
  <CaCard
    :class="classes"
    :style="styles">
    <template #header>
      <div :class="ns.e('title')">
        <input
          placeholder="请输入标题"
          v-model="articleForm.title"
          :class="ns.e('input')" />
      </div>
    </template>
    <template #footer>
      <div :class="ns.e('action-container')">
        <CaButton
          @click="handleSave('draft')"
          :loading="loading">
          保存草稿
        </CaButton>
        <CaButton
          @click="handleSave('publish')"
          :loading="loading">
          发布
        </CaButton>
      </div>
    </template>
    <CaRow
      :class="ns.e('context-container')"
      :gap="20">
      <CaCol :span="postContextWidth">
        <div :class="ns.e('textarea-container')">
          <CaTextarea
            v-show="mdEditMode === 'code'"
            v-model="articleForm.contentMd"
            :width="'100%'"
            :height="'100%'"
            :border="false"
            :class="ns.e('textarea')" />
          <!-- <textarea -->
          <!--   v-show="mdEditMode === 'code'" -->
          <!--   v-model="articleForm.contentMd" -->
          <!--   :class="ns.e('textarea')"></textarea> -->
          <MarkdownRender
            style="width: 100%; height: 100%"
            v-show="mdEditMode === 'read'"
            :content="articleForm.contentMd" />
          <CaRow
            v-show="mdEditMode === 'preview'"
            style="width: 100%; height: 100%">
            <CaCol :span="12">
              <CaTextarea
                v-model="articleForm.contentMd"
                :width="'100%'"
                :height="'100%'"
                :border="false"
                :class="ns.e('textarea')" />
            </CaCol>
            <CaCol :span="12">
              <MarkdownRender
                style="width: 100%; height: 100%"
                :content="articleForm.contentMd" />
            </CaCol>
          </CaRow>
        </div>
      </CaCol>
      <CaCol :span="24 - postContextWidth">
        <div :class="ns.e('meta-container')">
          <CaRow
            :align="'middle'"
            justify="center">
            <CaCol :span="12">
              <CaSwitch
                v-model="mdEditMode"
                :mode="'full'"
                :options="mdEditModeOptions"></CaSwitch>
            </CaCol>
          </CaRow>
          <CaRow>
            <CaCol :span="18">是否置顶</CaCol>
            <CaCol :span="6">
              <CaSwitch
                :options="booleanOptions"
                v-model="articleForm.isTop">
              </CaSwitch
            ></CaCol>
          </CaRow>
          <CaRow>
            <CaCol :span="18">是否原创</CaCol>
            <CaCol :span="6">
              <CaSwitch
                :options="booleanOptions"
                v-model="articleForm.isOriginal">
              </CaSwitch
            ></CaCol>
            <CaCol
              :span="24"
              v-show="articleForm.isOriginal === 'false'"
              >原链接地址</CaCol
            >
            <CaCol
              :span="24"
              v-show="articleForm.isOriginal === 'false'">
              <input v-model="articleForm.reprintSource" />
            </CaCol>
          </CaRow>
          <CaRow>
            <CaCol :span="18">是否允许评论</CaCol>
            <CaCol :span="6">
              <CaSwitch
                :options="booleanOptions"
                v-model="articleForm.allowComment" />
            </CaCol>
          </CaRow>
          <CaRow>
            <CaCol :span="24">友好链接</CaCol>
            <CaCol :span="24">
              <input
                v-model="articleForm.slug"
                @input="handleSlugInput" />
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
              <CaCascader
                v-model="articleForm.category"
                :options="categories"
                multiple
                clearable
                collapse-tags
                :max-collapse-tags="2" />
            </CaCol>
          </CaRow>
          <CaRow>
            <CaCol :span="24">标签</CaCol>
            <CaCol :span="24">
              <CaCheckboxGroup v-model="articleForm.tags">
                <CaCheckbox
                  v-for="tag in tags"
                  :key="tag.id"
                  :label="tag.name"
                  :value="tag.id" />
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
