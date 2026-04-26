<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useLoadingStore } from "@/store/useLoadingStore";
import { mockApiFetch } from "@/utils/mock";
import { CaRow } from "@/components/ca/CaRow";
import { CaCol } from "@/components/ca/caCol";

const route = useRoute();
const loadingStore = useLoadingStore();
const post = ref<any>(null);

// 模拟获取数据
onMounted(async () => {
  loadingStore.startLoading();
  // 模拟后端返回的数据结构
  const data = {
    id: route.query.id,
    title: '文章标题',
    content: '文章内容'
  };
  post.value = await mockApiFetch(data, 500);
  loadingStore.endLoading();
});
</script>

<template>
  <div class="post-detail-container" v-if="post">
    <ca-row :gap="40">
      <ca-col :span="17">
        <div class="main-content">
          <header class="article-header">
            <div class="breadcrumb">面包屑导航</div>
            <div class="title-area">文章标题</div>
            <div class="meta-info">文章元信息（作者、日期、分类、阅读量）</div>
          </header>

          <article class="article-body">
            文章内容
          </article>

          <footer class="article-footer">
            <div class="tags-area">文章标签</div>
            <div class="interaction-area">点赞、收藏、分享按钮</div>
            <div class="prev-next-nav">上一篇 / 下一篇</div>
          </footer>
        </div>
      </ca-col>

      <ca-col :span="7">
        <aside class="sidebar">
          <div class="author-card">作者卡片</div>
          <div class="toc-wrapper">文章目录导航</div>
          <div class="related-posts">相关文章推荐</div>
          <div class="sticky-area">其他固定悬浮内容</div>
        </aside>
      </ca-col>
    </ca-row>
  </div>
</template>

<style scoped>
/* 按照要求：使用 outline 显示结构框线 */
* {
  outline: 1px solid #aaa;
}

.post-detail-container {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: var(--content-padding);
}

.main-content, .sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.article-header {
  padding-bottom: 20px;
}

.article-body {
  min-height: 600px; /* 模拟内容高度 */
  padding: 20px 0;
}

.sidebar > div {
  padding: 20px;
  min-height: 100px; /* 模拟侧边栏组件高度 */
}

/* 确保侧边栏在滚动时能部分固定（符合现代博客设计） */
.toc-wrapper {
  position: sticky;
  top: 100px;
}
</style>