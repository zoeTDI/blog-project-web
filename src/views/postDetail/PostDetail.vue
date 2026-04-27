<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useRoute} from 'vue-router';
import {useLoadingStore} from "@/store/useLoadingStore";
import {mockApiFetch} from "@/utils/mock";
import {CaRow} from "@/components/ca/CaRow";
import {CaCol} from "@/components/ca/caCol";
import {ExclamationTriangleIcon, Squares2X2Icon, TagIcon} from '@heroicons/vue/24/outline'
import {ROUTER_NAMES} from "@/router/routerNames.ts";
import {MarkdownRender} from "@/components/markdownRender";

const route = useRoute();
const loadingStore = useLoadingStore();
const post = ref<any>(null);

const metaOptions = ref([
  {key: 'views', suffix: 'VIEWS', icon: '👁'},
  {key: 'likes', suffix: 'LIKES', icon: '♥'},
  {key: 'saved', suffix: 'SAVED', icon: '⭐'},
  {key: 'comments', suffix: 'COMMENTS', icon: '💬'},
])

const handleMetaOptions = () => {
  if (!Array.isArray(metaOptions.value)) {
    metaOptions.value = [];
  }
  console.log(metaOptions.value);
  metaOptions.value = metaOptions.value.filter((item) => {
    return !!post.value[item.key];
  })
  console.log(metaOptions.value)
}

const displaySuppleInfo = (): boolean => {
  if (!post.value?.lastUpdate) return false;
  const lastUpdate = new Date(post.value?.lastUpdate);
  const now = new Date();
  return now.getTime() - lastUpdate.getTime() > 2592000000; // 30*24*60*60*1000 30天未更新
}

// 模拟获取数据
onMounted(async () => {
  loadingStore.startLoading();
  // 模拟后端返回的数据结构
  const data = {
    id: route.query.id,
    title: '文章标题',
    content: '# 一级标题\n' +
        '## 二级标题\n' +
        '### 三级标题\n' +
        '#### 四级标题\n' +
        '##### 五级标题\n' +
        '**加粗内容**\n' +
        '*斜体内容*\n' +
        '> 引用内容\n' +
        '::: details 标题 \n' +
        ' 内容 \n' +
        ':::\n' +
        ' ![傍晚，你和她一起逃掉了晚自习来到了岸边吹风......](https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/img/2024-03-16%E5%82%8D%E6%99%9A%EF%BC%8C%E4%BD%A0%E5%92%8C%E5%A5%B9%E4%B8%80%E8%B5%B7%E9%80%83%E6%8E%89%E4%BA%86%E6%99%9A%E8%87%AA%E4%B9%A0%E6%9D%A5%E5%88%B0%E4%BA%86%E5%B2%B8%E8%BE%B9%E5%90%B9%E9%A3%8E.......jpg){width=80%}\n' +
        '::: tabs\n' +
        '@tab HTML\n' +
        '这是 HTML 的代码示例或说明\n' +
        '\n' +
        '@tab CSS\n' +
        '这是CSS的样式定义\n' +
        '\n' +
        '@tab JavaScript\n' +
        '这是JS的逻辑实现\n' +
        ':::\n',
    views: 30,
    likes: 12,
    stars: 22,
    comments: 23,
    releaseDate: '2023-04-12',
    lastUpdate: '2023-04-13',
  };
  post.value = await mockApiFetch(data, 500);
  handleMetaOptions();
  loadingStore.endLoading();
});
</script>

<template>
  <div class="post-detail-container" v-if="post">
    <ca-row :gap="40">
      <ca-col :span="17">
        <div class="main-content">
          <header class="article-header">
            <ca-row>
              <ca-col class="title-area">文章标题</ca-col>
            </ca-row>
            <ca-row class="meta-info">
              <ca-col class="meta-categories">
                <squares2-x2-icon class="icon"/>
                分类：
                <router-link :to="{name: ROUTER_NAMES.CATEGORY_DETAIL, query: {id: 124, name: '技术/框架/Vue'}}"
                             class="category">技术/框架/Vue
                </router-link>
                <router-link :to="{name: ROUTER_NAMES.CATEGORY_DETAIL, query: {id: 123, name: '学习/编程'}}"
                             class="category">学习/编程
                </router-link>
              </ca-col>
              <ca-col class="meta-tags">
                <tag-icon class="icon"/>
                标签：
                <router-link :to="{name: ROUTER_NAMES.TAG_DETAIL, query: {id: 123, name: '前端'}}" class="tag">#前端
                </router-link>
                <router-link :to="{name: ROUTER_NAMES.TAG_DETAIL, query: {id: 124, name: '设计模式'}}" class="tag">
                  #设计模式
                </router-link>
                <router-link :to="{name: ROUTER_NAMES.TAG_DETAIL, query: {id: 125, name: 'Vue3'}}" class="tag">#Vue3
                </router-link>
              </ca-col>
              <ca-col :span="18">
                <ca-row class="meta-items">
                  <ca-col class="meta-item" v-for="item in metaOptions" :key="item.key"
                          :span="24/metaOptions.length">
                    {{ item.icon }}
                    {{ post[item.key] || '暂无数据' }}
                    {{ item.suffix }}
                  </ca-col>
                </ca-row>
              </ca-col>
              <ca-col :span="6">
                <ca-row class="meta-date">
                  <ca-col class="release-date">发布：{{ post.releaseDate }}</ca-col>
                  <ca-col class="last-update">最后更新：{{ post.lastUpdate }}</ca-col>
                </ca-row>
              </ca-col>
            </ca-row>
            <ca-row>
              <ca-col class="supple-info" v-if="displaySuppleInfo">
                <exclamation-triangle-icon class="icon"/>
                补充说明 / WARNING：文章上次更新时间过于久远，信息可能失效。
              </ca-col>
            </ca-row>
          </header>

          <article class="article-body">
            <markdown-render :content="post.content"/>
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
.post-detail-container {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: var(--content-padding);
}

.article-header {
  border-bottom: 1px solid var(--border);
}

.title-area {
  font-family: var(--heading);
  line-height: 1;
  font-size: 64px;
  color: var(--text-h);
  font-weight: bold;
  margin-bottom: 20px;
}

.meta-categories {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  color: var(--text-h);
  font-family: var(--mono);
  font-weight: bold;
}

.meta-tags .icon,
.meta-categories .icon {
  width: 24px;
  height: 24px;
  aspect-ratio: 1 / 1;
  color: var(--text-h);
}

.meta-tags .tag,
.meta-categories .category {
  letter-spacing: 2px;
  padding: 4px;
  border-radius: 4px;
  transition: all .3s ease;
}

.meta-tags .tag:hover,
.meta-categories .category:hover {
  background-color: var(--accent-bg);
}

.meta-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  color: var(--text-h);
  font-family: var(--mono);
  font-weight: bold;
}

.meta-items {
  height: 100%;
}

.meta-item {
  font-size: 14px;
  display: flex;
  align-items: center;
}

.meta-date {
  font-size: 14px;
}

.supple-info {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 16px;
  background-color: var(--callout-warning-bg);
  color: var(--text-h);
}

.supple-info .icon {
  width: 24px;
  height: 24px;
  aspect-ratio: 1 / 1;
  color: var(--text-h);
  margin-right: 10px;
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