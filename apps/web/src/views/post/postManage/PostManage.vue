<script setup lang="ts">
  import type { BlogPostPageQueryDTO, PageResult } from '@/api';
  import { getCurrentUserPosts } from '@/api';
  import { POST_ROUTER_NAME } from '@/router/modules/posts';
  import {
    CaButton,
    CaPagination,
    CaSwitch,
    CaTable,
    CaTableColumn,
    type CaSwitchOption,
  } from '@caldm/ui';
  import { PencilSquareIcon, PlusIcon } from '@heroicons/vue/24/outline';
  import { computed, onMounted, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import type { BlogPostStatus, BlogPostSummaryDTO } from '#/blogPost.ts';

  type PageSize = BlogPostPageQueryDTO['size'];

  const router = useRouter();
  const currentPage = ref(1);
  const pageSize = ref<PageSize>(10);
  const pageResult = ref<PageResult<BlogPostSummaryDTO> | null>(null);
  const loading = ref(false);
  const errorMessage = ref('');
  let requestSequence = 0;

  const posts = computed(() => pageResult.value?.records ?? []);
  const totalPages = computed(() => pageResult.value?.pages ?? 0);
  const totalPosts = computed(() => pageResult.value?.total ?? 0);
  const pageSizeOptions: CaSwitchOption[] = [
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '50', label: '50' },
  ];

  const statusClass: Record<BlogPostStatus, string> = {
    草稿: 'is-draft',
    已发布: 'is-published',
    审核中: 'is-reviewing',
    回收站: 'is-recycled',
    私密: 'is-private',
  };

  const formatDateTime = (value: string | null) => {
    if (!value) return '-';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  };

  const loadPosts = async () => {
    const currentSequence = ++requestSequence;
    loading.value = true;
    errorMessage.value = '';

    try {
      const result = await getCurrentUserPosts({
        page: currentPage.value,
        size: pageSize.value,
      });

      if (currentSequence !== requestSequence) return;

      pageResult.value = result;
      if (result.pages > 0 && currentPage.value > result.pages) {
        currentPage.value = result.pages;
      }
    } catch {
      if (currentSequence === requestSequence) {
        errorMessage.value = '文章列表加载失败，请稍后重试。';
      }
    } finally {
      if (currentSequence === requestSequence) {
        loading.value = false;
      }
    }
  };

  const handlePageSizeChange = (
    value: string | number | symbol | undefined
  ) => {
    const nextPageSize = Number(value);
    if (![10, 20, 50].includes(nextPageSize)) return;

    currentPage.value = 1;
    pageSize.value = nextPageSize as PageSize;
  };

  const goToCreate = () => router.push({ name: POST_ROUTER_NAME.POST_NEW });
  const goToEdit = (id: number) =>
    router.push({ name: POST_ROUTER_NAME.POST_EDIT, params: { id } });

  watch([currentPage, pageSize], loadPosts);
  onMounted(loadPosts);
</script>

<template>
  <section class="post-manage">
    <header class="page-header">
      <div>
        <h2>文章管理</h2>
        <p>共 {{ totalPosts }} 篇文章</p>
      </div>
      <CaButton
        :icon="PlusIcon"
        @click="goToCreate"
        >发布新文章</CaButton
      >
    </header>

    <div
      class="table-area"
      :aria-busy="loading">
      <CaTable
        v-if="posts.length"
        :data="posts"
        :max-height="620"
        stripe
        high-current>
        <CaTableColumn
          prop="title"
          label="文章"
          :min-width="280">
          <template #default="{ row }: { row: BlogPostSummaryDTO }">
            <div class="post-title-cell">
              <div class="post-title-line">
                <strong>{{ row.title }}</strong>
                <span
                  v-if="row.isTop"
                  class="meta-tag is-top"
                  >置顶</span
                >
                <span class="meta-tag">{{
                  row.isOriginal ? '原创' : '转载'
                }}</span>
              </div>
              <span
                v-if="row.subtitle"
                class="post-subtitle"
                >{{ row.subtitle }}</span
              >
            </div>
          </template>
        </CaTableColumn>

        <CaTableColumn
          prop="type"
          label="类型"
          :width="100" />

        <CaTableColumn
          prop="status"
          label="状态"
          :width="96">
          <template #default="{ row }: { row: BlogPostSummaryDTO }">
            <span
              class="status"
              :class="statusClass[row.status]">
              {{ row.status }}
            </span>
          </template>
        </CaTableColumn>

        <CaTableColumn
          prop="views"
          label="数据"
          :width="158">
          <template #default="{ row }: { row: BlogPostSummaryDTO }">
            <span class="metrics">
              阅 {{ row.views }} · 赞 {{ row.likes }} · 评
              {{ row.commentCount }}
            </span>
          </template>
        </CaTableColumn>

        <CaTableColumn
          prop="publishedTime"
          label="发布时间"
          :width="168">
          <template #default="{ row }: { row: BlogPostSummaryDTO }">
            {{ formatDateTime(row.publishedTime) }}
          </template>
        </CaTableColumn>

        <CaTableColumn
          prop="actions"
          label="操作"
          :width="72">
          <template #default="{ row }: { row: BlogPostSummaryDTO }">
            <CaButton
              type="text"
              size="S"
              :icon="PencilSquareIcon"
              title="编辑文章"
              aria-label="编辑文章"
              @click="goToEdit(row.id)" />
          </template>
        </CaTableColumn>
      </CaTable>

      <div
        v-else
        class="table-state">
        <span v-if="loading">正在加载文章...</span>
        <template v-else-if="errorMessage">
          <span>{{ errorMessage }}</span>
          <CaButton
            type="outline"
            size="S"
            @click="loadPosts"
            >重试</CaButton
          >
        </template>
        <span v-else>暂无文章</span>
      </div>

      <div
        v-if="loading && posts.length"
        class="loading-mask">
        正在更新...
      </div>
    </div>

    <footer
      v-if="totalPosts"
      class="pagination-bar">
      <div class="page-size-control">
        <span>每页</span>
        <CaSwitch
          :model-value="String(pageSize)"
          :options="pageSizeOptions"
          mode="full"
          size="S"
          @update:model-value="handlePageSizeChange" />
        <span>条</span>
      </div>

      <CaPagination
        v-model="currentPage"
        :total="totalPages"
        :max-page="7"
        quick />
    </footer>
  </section>
</template>

<style scoped>
  .post-manage {
    --post-muted-color: color-mix(
      in srgb,
      var(--color-text-primary) 78%,
      transparent
    );
    --post-subtle-bg: color-mix(
      in srgb,
      var(--color-text-primary) 8%,
      var(--color-container-bg)
    );

    min-height: 100%;
    padding: 24px;
    box-sizing: border-box;
    border-radius: 4px;
    background-color: var(--color-container-bg);
    color: var(--color-text-primary);
  }

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
  }

  .page-header h2 {
    margin: 0;
    font-size: 20px;
    letter-spacing: 0;
  }

  .page-header p {
    margin: 5px 0 0;
    color: var(--post-muted-color);
    font-size: 13px;
  }

  .table-area {
    position: relative;
    min-height: 180px;
  }

  .table-state {
    display: flex;
    min-height: 180px;
    align-items: center;
    justify-content: center;
    gap: 12px;
    border: 1px solid var(--color-border);
    background-color: var(--post-subtle-bg);
    color: var(--post-muted-color);
  }

  .post-title-cell {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 4px;
  }

  .post-title-line {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 6px;
  }

  .post-title-line strong,
  .post-subtitle {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .post-title-line strong {
    font-weight: 600;
  }

  .post-subtitle,
  .metrics {
    color: var(--post-muted-color);
    font-size: 12px;
  }

  .meta-tag {
    flex: 0 0 auto;
    padding: 1px 5px;
    border: 1px solid var(--color-border);
    border-radius: 3px;
    color: var(--post-muted-color);
    font-size: 11px;
  }

  .meta-tag.is-top {
    border-color: color-mix(in srgb, #f0a020 70%, var(--color-border));
    color: color-mix(in srgb, #f0a020 72%, var(--color-text-h));
  }

  .status {
    display: inline-flex;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 12px;
    line-height: 18px;
  }

  .status.is-published {
    background: color-mix(in srgb, #22a06b 16%, var(--color-container-bg));
    color: color-mix(in srgb, #22a06b 72%, var(--color-text-h));
  }

  .status.is-draft {
    background: var(--post-subtle-bg);
    color: var(--color-text-primary);
  }

  .status.is-reviewing {
    background: color-mix(in srgb, #f0a020 16%, var(--color-container-bg));
    color: color-mix(in srgb, #f0a020 72%, var(--color-text-h));
  }

  .status.is-recycled {
    background: color-mix(in srgb, #d92d20 16%, var(--color-container-bg));
    color: color-mix(in srgb, #d92d20 72%, var(--color-text-h));
  }

  .status.is-private {
    background: color-mix(
      in srgb,
      var(--color-accent) 16%,
      var(--color-container-bg)
    );
    color: color-mix(in srgb, var(--color-accent) 72%, var(--color-text-h));
  }

  .loading-mask {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--color-container-bg) 76%, transparent);
    color: var(--color-text-primary);
    backdrop-filter: blur(2px);
    font-size: 13px;
  }

  .pagination-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-top: 20px;
  }

  .page-size-control {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--post-muted-color);
    font-size: 13px;
  }

  @media (max-width: 720px) {
    .post-manage {
      padding: 16px;
    }

    .page-header {
      align-items: flex-start;
    }

    .pagination-bar {
      align-items: flex-start;
      flex-direction: column;
    }
  }
</style>
