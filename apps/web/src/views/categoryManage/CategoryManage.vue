<template>
  <div class="page-card">
    <h2>分类管理</h2>
    <div class="category-list">
      <div class="category-item">前端技术 (12 篇)</div>
      <div class="category-item">后端架构 (5 篇)</div>
      <div class="category-item">生活随笔 (8 篇)</div>
    </div>
  </div>
</template>

<style scoped>
.page-card {
  background-color: #fff;
  border-radius: 4px;
  padding: 24px;
  min-height: 100%;
  box-sizing: border-box;
}
.category-list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.category-item {
  padding: 16px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
}
</style>