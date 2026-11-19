<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { CaRow, CaCol, CaMessage, CaIcon } from '@caldm/ui';
import {
  ChatBubbleLeftEllipsisIcon,
  ExclamationTriangleIcon,
  FireIcon,
  HeartIcon,
  Squares2X2Icon,
  StarIcon,
  TagIcon,
} from '@heroicons/vue/24/outline';
import { ROUTER_NAMES } from '@/router/routerNames.ts';
import { MarkdownRender } from '@/components/markdownRender';
import { PostActions } from '@/components/postActions';
import { fetchPublishedPostDetail } from '@/api';
import type { PublishPost } from '@/api';
const blogName = import.meta.env.VITE_WEB_SITE_NAME;

const route = useRoute();
const post = ref<PublishPost | null>(null);

const displaySuppleInfo = (): boolean => {
  if (!post.value?.updateTime) return false;
  const lastUpdate = new Date(post.value?.updateTime);
  const now = new Date();
  return now.getTime() - lastUpdate.getTime() > 2592000000; // 30*24*60*60*1000 30天未更新
};

// 版权说明文件
const currentUrl = ref('');
const authorName = ref('Caldm'); // 建议后续从文章数据中动态获取

/**
 * 拦截复制事件并追加版权信息
 */
const handleCopy = (event: ClipboardEvent) => {
  // 1. 获取用户实际选中的文本
  const selection = window.getSelection();
  if (!selection) return;
  const selectedText = selection.toString();

  // 2. 构建版权声明文本
  const copyrightNotice = `
  ------------------------------------------------
  作者：${authorName.value}
  链接：${currentUrl.value}
  来源：MyBlog
  著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
  ------------------------------------------------
  `;

  // 3. 将原文与版权信息拼接
  const clipboardData = selectedText + copyrightNotice;

  // 4. 写入剪贴板
  if (event.clipboardData) {
    event.clipboardData.setData('text/plain', clipboardData);
    // 阻止默认的复制行为，使用我们自定义的内容
    event.preventDefault();
  }
};

const parseNumber = (val: any) => {
  const parsed = Number(val);
  if (isNaN(parsed)) {
    return -1;
  } else {
    return parsed;
  }
}

// 模拟获取数据
onMounted(async () => {
  const id = parseNumber(route.params.id);
  if (id === -1) {
    CaMessage.error('文章请求出错');
    return;
  }

  fetchPublishedPostDetail({ id }).then(
    (res) => {
      post.value = res;
    }
  )
  currentUrl.value = window.location.href;
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
                <squares2-x2-icon class="icon" />
                分类：
                <router-link v-for="cate in post.categories" :key="cate.category.id"
                  :to="{ name: ROUTER_NAMES.CATEGORY_DETAIL, params: { id: cate.category.id, name: cate.category.name } }">
                  {{ cate.category.name }}
                </router-link>
              </ca-col>
              <ca-col class="meta-tags">
                <tag-icon class="icon" />
                标签：
                <router-link v-for="tag in post.tags" :key="tag.id" :to="{
                  name: ROUTER_NAMES.TAG_DETAIL,
                  params: { id: tag.id, name: tag.name }
                }" class="tag">
                  {{ tag.name }}
                </router-link>
              </ca-col>
              <ca-col :span="18">
                <ca-row class="meta-items">
                  <ca-col class="meta-item" :span="6">
                    <ca-icon :icon="FireIcon" />
                    {{ !!post.views ? post.views : '暂无数据' }}
                  </ca-col>
                  <ca-col class="meta-item" :span="6">
                    <ca-icon :icon="HeartIcon" />
                    {{ !!post.likes ? post.likes : '暂无数据' }}
                  </ca-col>
                  <ca-col class="meta-item" :span="6">
                    <ca-icon :icon="StarIcon" />
                    {{ !!post.collects ? post.collects : '暂无数据' }}
                  </ca-col>
                  <ca-col class="meta-item" :span="6">
                    <ca-icon :icon="ChatBubbleLeftEllipsisIcon" />
                    {{ !!post.commentCount ? post.commentCount : '暂无数据' }}
                  </ca-col>
                </ca-row>
              </ca-col>
              <ca-col :span="6">
                <ca-row class="meta-date">
                  <ca-col class="release-date">发布：{{ post.publishedTime.slice(0, 10) }}</ca-col>
                  <ca-col class="last-update">最后更新：{{ post.updateTime.slice(0, 10) }}</ca-col>
                </ca-row>
              </ca-col>
            </ca-row>
            <ca-row>
              <ca-col class="supple-info" v-if="displaySuppleInfo()">
                <exclamation-triangle-icon class="icon" />
                补充说明 / WARNING：文章上次更新时间过于久远，信息可能失效。
              </ca-col>
            </ca-row>
          </header>

          <article class="article-body" @copy="handleCopy">
            <markdown-render :content="post.contentMd" :caption-mode="'always'" />
          </article>

          <footer class="article-footer">
            <post-actions />
            <post-actions :mode="'circle'" />
            <div class="prev-next-nav">
              <router-link :to="{ name: ROUTER_NAMES.POST_DETAIL, params: { id: 3 } }" class="prev">上一篇</router-link>
              /
              <router-link :to="{ name: ROUTER_NAMES.POST_DETAIL, params: { id: 4 } }" class="next">下一篇</router-link>
            </div>
            <div class="copyright-info">
              <div class="copyright-item">
                <span class="label">文章作者：</span>
                <span class="value">{{ post.author }}</span>
                <!-- 建议后续改为动态变量 -->
              </div>
              <div class="copyright-item">
                <span class="label">文章链接：</span>
                <a :href="currentUrl" class="value link">{{ currentUrl }}</a>
              </div>
              <div class="copyright-item">
                <span class="label">版权声明：</span>
                <span class="value">
                  本博客所有文章除特别声明外，均采用
                  <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh" target="_blank" class="link">CC
                    BY-NC-ND 4.0</a>
                  许可协议。转载请注明来自
                  <router-link to="/" class="link">{{ blogName }}</router-link>！
                </span>
              </div>
            </div>
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
  max-width: var(--content-max-width-M);
  margin: 0 auto;
  padding: var(--content-padding-M);
}

.article-header {
  border-bottom: 1px solid var(--color-border);
}

.title-area {
  font-family: var(--font-h);
  line-height: 1;
  font-size: 64px;
  color: var(--color-text-h);
  font-weight: bold;
  margin-bottom: 20px;
}

.meta-categories {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  color: var(--color-text-h);
  font-family: var(--font-text);
  font-weight: bold;
}

.meta-tags .icon,
.meta-categories .icon {
  width: 24px;
  height: 24px;
  aspect-ratio: 1 / 1;
  color: var(--color-text-h);
}

.meta-tags .tag,
.meta-categories .category {
  letter-spacing: 2px;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.meta-tags .tag:hover,
.meta-categories .category:hover {
  background-color: var(--color-bg-hover-accent);
}

.meta-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  color: var(--color-text-h);
  font-family: var(--font-text);
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
  color: var(--color-callout-text);
}

.supple-info .icon {
  width: 24px;
  height: 24px;
  aspect-ratio: 1 / 1;
  color: var(--color-callout-text);
  margin-right: 10px;
}

.main-content,
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.article-header {
  padding-bottom: 20px;
}

.article-body {
  min-height: 600px;
  /* 模拟内容高度 */
  padding: 20px 0;
}

.prev-next-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
}

.prev-next-nav a {
  transition: all 0.3s ease;
}

.prev-next-nav a:hover {
  color: var(--color-text-hover-accent);
}

.copyright-info {
  margin-top: 32px;
  padding: 16px 20px;
  border-left: 5px solid var(--color-border-accent);
  background-color: var(--color-bg);
  border-radius: 4px;
  font-size: 14px;
  color: var(--color-text-primary);
  line-height: 1.8;
}

.copyright-item {
  margin-bottom: 4px;
}

.copyright-item:last-child {
  margin-bottom: 0;
}

.copyright-item .label {
  font-weight: bold;
  color: var(--color-text-h);
}

.copyright-item .link {
  color: var(--color-accent);
  text-decoration: none;
  transition: opacity 0.2s;
  word-break: break-all;
}

.copyright-item .link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.sidebar>div {
  padding: 20px;
  min-height: 100px;
  /* 模拟侧边栏组件高度 */
}

/* 确保侧边栏在滚动时能部分固定（符合现代博客设计） */
.toc-wrapper {
  position: sticky;
  top: 100px;
}
</style>
