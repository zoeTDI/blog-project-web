<script setup lang="ts">
interface Article {
  id: number;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  cover?: string;
}

defineProps<{
  article: Article;
  mode: 'list' | 'card';
}>();
</script>

<template>
  <article class="article-renderer-item" :class="[mode === 'list' ? 'is-list' : 'is-card']">
    <div v-if="article?.cover" class="article-cover">
      <img :src="article.cover" alt="cover"/>
    </div>

    <div class="article-info">
      <header class="info-header">
        <h2 class="article-title">{{ article.title }}</h2>
        <p class="article-summary">{{ article.summary }}</p>
      </header>

      <footer class="info-footer">
        <span class="article-date">{{ article.date }}</span>
        <div class="article-tags">
          <span v-for="tag in article.tags" :key="tag" class="tag-item">#{{ tag }}</span>
        </div>
      </footer>
    </div>
  </article>
</template>

<style scoped>

.article-renderer-item {
  background-color: var(--bg-color);
  border: 1px solid var(--border);
  display: flex;
  overflow: hidden;
  transition: transform 0.3s ease, border-color 0.3s;
}

.article-renderer-item:hover {
  border-color: var(--accent);
}


.article-title {
  font-family: var(--heading);
  color: var(--text-h);
  margin-bottom: 8px;
}

.article-summary {
  font-size: 14px;
  color: var(--text);
  opacity: 0.8;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-info {
  display: flex;
  flex-direction: column; /* 开启纵向 Flex 布局 */
  flex: 1;
}

.info-footer {
  margin-top: auto; /* 核心技巧：将 footer 推至容器底部 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px; /* 增加一点间距，防止文字太近 */
}

.article-date {
  font-family: var(--mono);
  font-size: 12px;
  opacity: 0.6;
}

.tag-item {
  font-size: 11px;
  margin-left: 8px;
  color: var(--accent);
}

/* --- 1. 列表模式 (List Mode) --- */
.is-list {
  flex-direction: row;
  padding: 24px;
  min-height: 180px;
}

.is-list .article-cover {
  order: 2;
  width: 240px;
  height: 150px;
  margin-left: 32px;
  flex-shrink: 0;
}

/* --- 2. 卡片模式 (Card Mode) --- */
.is-card {
  flex-direction: column;
  height: 420px;
}
.is-card .article-cover {
  width: 100%; height: 55%; flex-shrink: 0;
}
.is-card .article-info { padding: 20px; }

.article-cover img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.article-renderer-item:hover .article-cover img { transform: scale(1.05); }

/* 图片通用处理 */
.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.article-item:hover .article-cover img {
  transform: scale(1.05);
}

/* 响应式断点 */
@media (max-width: 1200px) {
  .is-card {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .is-card {
    grid-template-columns: 1fr;
  }

  .is-list .article-item {
    flex-direction: column;
  }

  .is-list .article-cover {
    width: 100%;
    margin: 16px 0 0 0;
    order: -1;
  }
}
</style>