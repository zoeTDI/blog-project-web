<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {ArticleRenderer, ViewSwitcher} from "@/components/viewSwitcher";

interface Article {
  id: number;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  cover?: string; // 可选的头图
}

// 1. 网页公告数据
const announcement = {
  title: "四月进度与学习笔记更新说明",
  content: `这是一个超过500字的示例内容...（此处省略实际字数）。
  在这里你可以写下近期的技术感悟、博客的更新日志或者是对读者的寄语。
  我们的系统会自动检测这段文字的长度，如果超过500个字符，
  它将呈现出一种优雅的半透明渐变遮罩效果，引导用户点击查看全文。
  这种设计不仅保持了页面的极简视觉感，也避免了长篇大论直接占据过多的首屏空间。
  技术栈方面，我们坚持使用衬线体配合细线条，力求在信息密度和呼吸感之间取得平衡。
  接下来的文章列表，你可以自由切换“列表”或“卡片”模式，
  这也是为了方便不同阅读习惯的用户——列表模式适合快速扫读标题，
  而卡片模式则更适合展示带有视觉张力的技术头图...`
};

// 3. 公告区域内容
const isExpanded = ref(false);
const threshold = 500;

const needsCollapse = computed(() => announcement.content.length > threshold);

const displayedContent = computed(() => {
  if (!needsCollapse.value || isExpanded.value) {
    return announcement.content;
  }
  return announcement.content.slice(0, threshold) + '...';
})

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
}

// 4. 视图切换
// 视图模式类型：'list' 为列表，'card' 为卡片
const viewMode = ref<'list' | 'card'>('list');

// 切换模式函数
const setViewMode = (mode: 'list' | 'card') => {
  viewMode.value = mode;
};

// 5. 分页相关
const pageSize = 10;
const currentPage = ref<number>(1);
const isLoading = ref<boolean>(false);
const noMore = ref<boolean>(false);
const allArticles = ref<Article[]>([]);
// mock api func
const fetchArticlesApi = async (page: number) => {
  return new Promise<Article[]>((resolve) => {
    setTimeout(() => {
      const newBatch = Array.from({length: pageSize}).map((_, i) => ({
        id: (page - 1) * pageSize + i,
        title: `文章标题 #${(page - 1) * pageSize + i}`,
        summary: "这是分页加载的模拟摘要内容...",
        date: "2024-04-23",
        tags: ["Vue3", "分页"],
        cover: i % 3 === 0 ? "https://picsum.photos/seed/" + Math.random() + "/800/450" : undefined
      }));
      resolve(newBatch);
    }, 800);
  })
}

const loadMore = async () => {
  if (isLoading.value || noMore.value) return;
  isLoading.value = true;
  const newItems = await fetchArticlesApi(currentPage.value);
  if (newItems.length < pageSize) {
    noMore.value = true;
  }
  allArticles.value.push(...newItems);
  currentPage.value++;
  isLoading.value = false;
}

onMounted(() => {
  loadMore();
})
</script>

<template>
  <div class="list">
    <section class="announcement-section" :class="{ 'is-collapsed': !isExpanded && needsCollapse }">
      <h2 class="announcement-title">{{ announcement.title }}</h2>

      <div class="announcement-content-wrapper">
        <div class="announcement-text">
          {{ displayedContent }}
        </div>

        <div v-if="needsCollapse && !isExpanded" class="content-mask" @click="toggleExpand">
          <button class="expand-btn">展开全部内容</button>
        </div>

        <div v-if="isExpanded" class="collapse-footer">
          <button class="expand-btn" @click="toggleExpand">收起详细内容</button>
        </div>
      </div>
    </section>
    <ViewSwitcher
        v-model="viewMode"
        :total="allArticles.length"
        :cols="{ desktop: 3, tablet: 2, mobile: 1 }"
    >
      <ArticleRenderer
          v-for="article in allArticles"
          :key="article.id"
          :article="article"
          :mode="viewMode"
      />
    </ViewSwitcher>

    <div class="load-more-section">
      <button
          v-if="!noMore"
          :disabled="isLoading"
          @click="loadMore"
          class="load-more-btn"
      >
        <span v-if="isLoading" class="loading-spinner">LOADING...</span>
        <span v-else>LOAD MORE</span>
      </button>

      <div v-else class="no-more-text">
        — END OF JOURNEY —
      </div>
    </div>
  </div>
</template>

<style scoped>
.list {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.announcement-section {
  position: relative;
  margin-bottom: 40px;
}

.announcement-title {
  /* 继承全局 h2 衬线体 */
  margin-bottom: 24px;
  position: relative;
  display: inline-block;
}

/* 标题下方的装饰短线 */
.announcement-title::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 30px;
  height: 1px;
  background-color: var(--accent);
}

.announcement-content-wrapper {
  position: relative;
  line-height: 1.8;
  font-size: 16px;
  color: var(--text);
}

.announcement-text {
  white-space: pre-wrap; /* 保留换行 */
}

/* 渐变遮罩层 */
.content-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px; /* 遮罩高度 */
  background: linear-gradient(to bottom, transparent, var(--bg));
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 10px;
  cursor: pointer;
  transition: height 0.3s ease;
}

.content-mask:hover {
  height: 120px; /* 悬停时遮罩稍微上移，增加引导性 */
}

/* 极简按钮样式 */
.expand-btn {
  background: none;
  border: 1px solid var(--border);
  padding: 8px 24px;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text);
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
}

.expand-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.collapse-footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.load-more-section {
  margin-top: 60px;
  display: flex;
  justify-content: center;
  padding-bottom: 40px;
}

.load-more-btn {
  background: none;
  border: 1px solid var(--border);
  padding: 12px 40px;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text);
  cursor: pointer;
  letter-spacing: 2px;
  transition: all 0.3s ease;
}

.load-more-btn:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
  padding: 12px 60px; /* 悬停时稍微拉长，增加动态感 */
}

.load-more-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.no-more-text {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text);
  opacity: 0.4;
  letter-spacing: 4px;
}

/* 简单的加载文字闪烁动画 */
.loading-spinner {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
}
</style>