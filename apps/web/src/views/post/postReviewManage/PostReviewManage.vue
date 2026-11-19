<script setup lang="ts">
import { fetchReviewingPostPage, reject, toPublished } from '@/api';
import type { BlogPostSummaryDTO } from '@/types/blogPost';
import { useCSSNamespace } from '@caldm/hook';
import { CaButton, CaTable, CaTableColumn } from '@caldm/ui'
import { onMounted, ref } from 'vue';


// TODO: 待审核文章页尚未完成的功能
// - 分页：目前只取第 1 页 10 条，缺少页码/每页条数状态和分页器
// - 加载与错误态：loading 从未置为 true，请求失败没有捕获，也没有空态、失败提示和重试入口
// - 审核详情：未接入 fetchReviewingDetail，审核前无法查看文章正文、封面等内容
// - 操作反馈：审核通过/拒绝没有二次确认、单行 pending 状态和失败提示，成功后也未刷新列表或同步 total
// - 拒绝原因：reject 目前只传 postId，没有填写/展示拒绝理由的入口
// - 权限校验：仅依赖路由 requireLogin，未校验当前用户是否具备审核权限
// - 未使用的导入：CheckIcon、XMarkIcon 尚未使用，待改为图标按钮或删除

const ns = useCSSNamespace('post-review');

// TODO: loading 未接入，请求开始与结束时需要置位，用于表格遮罩和 aria-busy
const loading = ref(false);
const total = ref<number>(0);

const formData = ref<BlogPostSummaryDTO[]>([]);

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

const handleToPublish = async (data: BlogPostSummaryDTO) => {
  // TODO: 缺少二次确认、单行 loading、异常捕获与失败提示；
  // 成功后应刷新列表并递减 total，而不是只改本地 status（分页数据会与后端不一致）
  await toPublished({ postId: data.id });
  data.status = '已发布';
}

const handleReject = async (data: BlogPostSummaryDTO) => {
  // TODO: 缺少二次确认、拒绝理由输入、单行 loading、异常捕获与失败提示；
  // 成功后应刷新列表并递减 total，而不是只改本地 status
  await reject({ postId: data.id });
  data.status = '草稿';
}

// TODO: 缺少 try/catch 与错误提示；分页参数写死为第 1 页 10 条，应改为响应式状态
onMounted(async () => {
  const res = await fetchReviewingPostPage({ page: 1, size: 10 });
  total.value = res.total;
  formData.value = res.records;
})

</script>

<template>
  <section :class="ns.b()">
    <header :class="ns.e('header')">
      <div>
        <h2>待审核文章</h2>
        <p>共 {{ total }} 篇文章</p>
      </div>
    </header>
    <!-- TODO: 缺少加载中/空数据/加载失败与重试状态；loading 已绑定 aria-busy 但尚未生效 -->
    <section :class="ns.e('body')" :aria-busy="loading">
      <!-- TODO: 未提供查看文章详情/正文的入口，审核通过或拒绝前无法完整核对内容 -->
      <CaTable :data="formData" :max-height="620" stripe high-current>
        <CaTableColumn prop="title" label="文章" :min-width="280">
          <template #default="{ row }: { row: BlogPostSummaryDTO }">
            <div :class="ns.e('title-cell')">
              <div :class="ns.e('title-line')">
                <strong>{{ row.title }}</strong>
                <span v-if="row.isTop" :class="[ns.is('meta-tag'), ns.is('top')]">置顶</span>
                <span :class="ns.e('meta-tag')">
                  {{ row.isOriginal ? '原创' : '转载' }}
                </span>
              </div>
              <span v-if="row.subtitle" :class="ns.e('subtitle')">
                {{ row.subtitle }}
              </span>
            </div>
          </template>
        </CaTableColumn>
        <CaTableColumn prop="type" label="类型" :width="100" />
        <CaTableColumn prop="status" label="状态" :width="96">
          <template #default="{ row }: { row: BlogPostSummaryDTO }">
            <span class="status" :class="ns.is('review', true)">
              {{ row.status }}
            </span>
          </template>
        </CaTableColumn>
        <CaTableColumn prop="views" label="数据" :width="158">
          <template #default="{ row }: { row: BlogPostSummaryDTO }">
            <span class="metrics">
              阅 {{ row.views }} · 赞 {{ row.likes }} · 评
              {{ row.commentCount }}
            </span>
          </template>
        </CaTableColumn>
        <CaTableColumn prop="publishedTime" label="发布时间" :width="168">
          <template #default="{ row }: { row: BlogPostSummaryDTO }">
            {{ formatDateTime(row.publishedTime) }}
          </template>
        </CaTableColumn>

        <CaTableColumn prop="actions" label="操作" :width="72">
          <template #default="{ row }: { row: BlogPostSummaryDTO }">
            <CaButton type="text" size="S" title="审核通过" aria-label="审核通过" :disabled="row.status != '审核中'"
              @click="handleToPublish(row)">
              审核通过
            </CaButton>
            <CaButton type="text" size="S" title="拒绝" aria-label="拒绝" :disabled="row.status != '审核中'"
              @click="handleReject(row)">
              拒绝
            </CaButton>
          </template>
        </CaTableColumn>
      </CaTable>
    </section>
  </section>
</template>

<style lang="css" scoped>
.ca-post-review {
  width: 100%;
}
</style>