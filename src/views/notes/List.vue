<script setup lang="ts">
import {nextTick, onMounted, ref} from "vue";
import {ArticleRenderer, ViewSwitcher} from "@/components/viewSwitcher";
import type {Article} from "#/article.ts";
import {useLoadingStore} from "@/store/useLoadingStore.ts";
import {CaButton} from "@/components/ca/caButton";

// 1. 网页公告数据
const announcement = {
  title: "四月进度与学习笔记更新说明",
  content: `这是一个超过500字的示例内容...（此处省略实际字数）。\n
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
const contentRef = ref<HTMLElement | null>(null);
const needsCollapse = ref(false);
const MAX_VISUAL_HEIGHT = 280; // 设定最大显示高度（像素）

// 检测高度的函数
const checkHeight = () => {
  if (contentRef.value) {
    // 如果实际高度大于阈值，则需要折叠
    needsCollapse.value = contentRef.value.scrollHeight > MAX_VISUAL_HEIGHT;
  }
};

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

const loadingStore = useLoadingStore();

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

onMounted(async () => {
  await nextTick();
  checkHeight();
  window.addEventListener('resize', () => {
    checkHeight()
  });
  await loadMore();
  await loadingStore.endLoading();
})
</script>

<template>
  <div class="list">
    <section class="announcement-section">
      <h2 class="announcement-title">{{ announcement.title }}</h2>

      <div class="announcement-content-wrapper">
        <div
            ref="contentRef"
            class="announcement-text"
            :style="{
            maxHeight: (!isExpanded && needsCollapse) ? MAX_VISUAL_HEIGHT + 'px' : 'none'
          }"
        >
          {{ announcement.content }}
        </div>

        <div v-if="needsCollapse && !isExpanded" class="content-mask">
          <ca-button type="text" @click="toggleExpand">EXPAND</ca-button>
        </div>
        <div v-if="isExpanded" class="collapse-footer">
          <CaButton type="text" @click="toggleExpand">CLOSE</CaButton>
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
          :meta-config="{ showDate: true, showViews: true, showTags: true, showLikes: true, showAuthor: true, showUpdatedDate: true, showComments: true, showFavorites: true }"
      />
    </ViewSwitcher>

    <div class="load-more-section">
      <CaButton  :loading="isLoading" hover-effect="expand" @click="loadMore">
        LOAD MORE
      </CaButton>
    </div>
  </div>
</template>

<style scoped>
.list {
  max-width: var(--content-max-width);
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

.announcement-text {
  white-space: pre-wrap;
  line-height: 1.8;
  overflow: hidden;
}

.announcement-content-wrapper {
  position: relative;
}

/* 渐变遮罩层样式微调 */
.content-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px; /* 稍微加高遮罩，让渐变更自然 */
  background: linear-gradient(to bottom, transparent, var(--bg) 90%);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 0;
  cursor: pointer;
}

.content-mask:hover {
  height: 120px; /* 悬停时遮罩稍微上移，增加引导性 */
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

</style>