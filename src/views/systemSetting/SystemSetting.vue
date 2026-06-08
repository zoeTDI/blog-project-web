<template>
  <div class="page-card">
    <h2>系统设置</h2>
    <div class="setting-form">
      <div class="form-item">
        <label>网站名称：</label>
        <input type="text" value="我的技术博客" />
      </div>
      <div class="form-item">
        <label>每页文章数：</label>
        <input type="number" value="10" />
      </div>
      <div class="form-item">
        <label>开放评论关闭：</label>
        <input type="checkbox" checked />
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
.setting-form {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 400px;
}
.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-item input[type="text"], .form-item input[type="number"] {
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}
</style>