<template>
  <div class="page-card">
    <div class="page-header">
      <h2>文章管理</h2>
      <button class="demo-btn">🔥 发布新文章</button>
    </div>
    <div class="demo-table">
      <div class="table-header">
        <span>文章标题</span>
        <span>状态</span>
        <span>发布时间</span>
      </div>
      <div class="table-row">
        <span>Vue3 核心原理深度解析</span>
        <span class="status published">已发布</span>
        <span>2026-06-01</span>
      </div>
      <div class="table-row">
        <span>CSS Grid 经典后台布局实战</span>
        <span class="status draft">草稿</span>
        <span>2026-06-07</span>
      </div>
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
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.demo-btn {
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
.demo-table {
  border: 1px solid #f0f0f0;
}
.table-header, .table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}
.table-header {
  background-color: #fafafa;
  font-weight: bold;
}
.status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  width: fit-content;
}
.published { background-color: #e6f7ff; color: #1890ff; }
.draft { background-color: #f5f5f5; color: #999; }
</style>