<script setup lang="ts">
import {onMounted, ref} from "vue";
import {CaRow} from "@/components/ca/CaRow";
import {CaCol} from "@/components/ca/caCol";
import {useLoadingStore} from "@/store/useLoadingStore.ts";
import {CaSection} from "@/components/ca/caSection";
import {TagCloud} from "@/components/tagCloud";

// 标签云
// Mock 标签数据
const tags = ref([
  { name: 'Vue3', count: 25 },
  { name: 'JavaScript', count: 30 },
  { name: 'TypeScript', count: 18 },
  { name: 'Canvas', count: 12 },
  { name: 'CSS布局', count: 22 },
  { name: '前端工程化', count: 8 },
  { name: '极简主义', count: 15 },
  { name: 'Three.js', count: 5 },
  { name: '性能优化', count: 14 },
  { name: '算法', count: 6 },
  { name: 'Node.js', count: 10 },
  { name: 'Vite', count: 20 },
]);

const loadingStore = useLoadingStore();
onMounted(() => {
  loadingStore.endLoading();
})
</script>

<template>
  <div class="archive">
    <ca-row>
      <ca-col>
        <h2 class="page-title">文章归档 / ARCHIVES</h2>
      </ca-col>
    </ca-row>
    <ca-row :gap="40">
      <ca-col :span="18">
        <ca-section title="所有标签 / ALL TAGS">
          <tag-cloud :tags="tags" />
        </ca-section>
      </ca-col>
      <ca-col :span="6">
        <ca-section title="所有分类 / ALL CATEGORIES">
          Category
        </ca-section>
      </ca-col>
    </ca-row>
    <ca-row>
      <ca-col>
        <ca-section title="按月份 / BY MONTH" subtitle="ALL POSTS / 10">
          Note List
        </ca-section>
      </ca-col>
    </ca-row>
  </div>
</template>

<style scoped>
* {
  min-height: 40px;
}

.archive {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 40px 20px;
}

.page-title {
  font-size: 48px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 55px;
}
</style>