<script setup lang="ts">
import { computed } from 'vue';
import type {Article, MetaConfig} from "#/article.ts";
import {useRouter} from "vue-router";
import {ROUTER_NAMES} from "@/router/routerNames.ts";

const router = useRouter();
const props = defineProps<{
  article: Article;
  mode: 'list' | 'card';
  // 默认配置：仅显示日期和标签
  metaConfig?: MetaConfig;
}>();

const config = computed(() => ({
  showDate: true,
  showTags: true,
  ...props.metaConfig
}));

// 3. 动态过滤需要显示的元数据（不含标签，因为标签通常需要特殊样式）
const activeMetaList = computed(() => {
  const list = [];
  // 辅助函数：仅在列表模式下返回后缀文字
  const getSuffix = (text: string) => (props.mode === 'list' ? text : '');

  if (config.value.showAuthor && props.article.author) {
    list.push({ label: props.article.author, icon: '👤', suffix: '' });
  }
  if (config.value.showDate) {
    list.push({ label: props.article.date, icon: '', suffix: '' });
  }
  if (config.value.showUpdatedDate && props.article.updatedDate) {
    list.push({ label: props.article.updatedDate, icon: '', suffix: getSuffix(' UPDATED') });
  }
  if (config.value.showViews) {
    list.push({ label: `${props.article.views || 0}`, icon: '👁', suffix: getSuffix(' VIEWS') });
  }
  if (config.value.showLikes) {
    list.push({ label: `${props.article.likes || 0}`, icon: '♥', suffix: getSuffix(' LIKES') });
  }
  if (config.value.showComments) {
    list.push({ label: `${props.article.comments || 0}`, icon: '💬', suffix: getSuffix(' COMMENTS') });
  }
  if (config.value.showFavorites) {
    list.push({ label: `${props.article.favorites || 0}`, icon: '⭐', suffix: getSuffix(' SAVED') });
  }
  return list;
});

const handleTagClick = (value) => {
  router.push({name: ROUTER_NAMES.TAG_DETAIL, query: {...value}});
}
const toPostDetail = () => {
  console.log(props.article)
  router.push({name: ROUTER_NAMES.POST_DETAIL, query: {id: props.article.id}});
}
</script>

<template>
  <article class="article-renderer-item" :class="[`is-${mode}`]">
    <div v-if="article?.cover" class="article-cover">
      <img :src="article.cover" alt="cover" loading="lazy"/>
    </div>

    <div class="article-info">
      <header class="info-header" @click="toPostDetail">
        <h2 class="article-title">{{ article.title }}</h2>
        <p class="article-summary">{{ article.summary }}</p>
      </header>

      <footer class="info-footer">
        <div class="meta-group-main">
          <span v-for="(item, index) in activeMetaList" :key="index" class="meta-item">
            <span v-if="item.icon" class="meta-icon">{{ item.icon }}</span>
            <span class="meta-label">{{ item.label }}</span>
            <span v-if="item.suffix" class="meta-suffix">{{ item.suffix }}</span>
          </span>
        </div>

        <div v-if="config.showTags && article.tags?.length" class="meta-group-tags">
          <span v-for="tag in article.tags" :key="tag" class="tag-item" @click="handleTagClick(tag)">#{{ tag }}</span>
        </div>
      </footer>
    </div>
  </article>
</template>

<style scoped>
.article-renderer-item {
  background-color: var(--bg);
  border: 1px solid var(--border);
  display: flex;
  overflow: hidden;
  transition: all 0.3s ease;
}

.article-renderer-item:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}

.info-header {
  cursor: pointer;
}

.article-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0; /* 防止长文字撑破布局 */
}

/* 标题与摘要 */
.article-title {
  font-family: var(--heading);
  color: var(--text-h);
  font-size: 1.25rem;
  margin-bottom: 12px;
  line-height: 1.4;
}

.article-summary {
  font-size: 14px;
  color: var(--text);
  opacity: 0.7;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 底部元数据布局 */
.info-footer {
  margin-top: auto;
  padding-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end; /* 底部对齐 */
  flex-wrap: wrap;
  gap: 12px;
}

.meta-group-main {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-family: var(--mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.6;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.meta-suffix {
  opacity: 0.7;
  margin-left: 2px;
}

.meta-group-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.tag-item {
  font-size: 11px;
  color: var(--accent);
  cursor: pointer;
  transition: all .3s ease;
  padding: 2px 4px;
}

.tag-item:hover {
  background-color: var(--bg-gray);
}

/* --- 模式特定样式 --- */

/* 1. 列表模式 */
.is-list {
  flex-direction: row;
  padding: 30px;
  min-height: 200px;
}
.is-list .article-cover {
  order: 2;
  width: 280px;
  height: 180px;
  margin-left: 40px;
  flex-shrink: 0;
}

/* 2. 卡片模式 */
.is-card {
  flex-direction: column;
  height: 460px;
}
.is-card .article-cover {
  width: 100%;
  height: 50%;
  flex-shrink: 0;
}
.is-card .article-info {
  padding: 24px;
}
.is-card .info-footer {
  /* 卡片模式下，如果元数据和标签挤在一起，改为垂直堆叠 */
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
.is-card .meta-group-tags {
  justify-content: flex-start;
}

/* 图片处理 */
.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.article-renderer-item:hover .article-cover img {
  transform: scale(1.08);
}

@media (max-width: 768px) {
  .is-list {
    flex-direction: column;
    padding: 20px;
  }
  .is-list .article-cover {
    width: 100%;
    margin: 0 0 20px 0;
    order: -1;
  }
}
</style>