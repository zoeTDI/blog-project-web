<script setup lang="ts">
import { ref } from 'vue'

// 模拟表单数据
const articleForm = ref({
  title: '',
  category: '',
  tags: [] as string[],
  content: '',
  isDraft: false
})

// 模拟提交事件
const handlePublish = (type: 'draft' | 'publish') => {
  articleForm.value.isDraft = type === 'draft'
  alert(`触发操作：[${type === 'draft' ? '保存草稿' : '发布文章'}]。当前标题: "${articleForm.value.title || '未填写'}"（此为演示界面，暂无实际后端交互）`)
}
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h2>✍️ 发布与编辑文章</h2>
      <p class="sub-title">在这里撰写您的新博客文章，支持设置分类、标签以及内容编辑。</p>
    </div>

    <div class="form-card">
      <div class="form-item">
        <label>文章标题：</label>
        <input v-model="articleForm.title" type="text" placeholder="请输入文章标题..." class="styled-input" />
      </div>

      <div class="form-row">
        <div class="form-item">
          <label>所属分类：</label>
          <select v-model="articleForm.category" class="styled-select">
            <option value="">请选择分类</option>
            <option value="tech">技术分享</option>
            <option value="life">生活随笔</option>
            <option value="game">游戏评测</option>
          </select>
        </div>

        <div class="form-item">
          <label>文章标签（多选）：</label>
          <div class="checkbox-group">
            <label><input type="checkbox" value="Vue3" v-model="articleForm.tags"> Vue3</label>
            <label><input type="checkbox" value="TypeScript" v-model="articleForm.tags"> TypeScript</label>
            <label><input type="checkbox" value="随笔" v-model="articleForm.tags"> 随笔</label>
          </div>
        </div>
      </div>

      <div class="form-item">
        <label>文章内容：</label>
        <textarea v-model="articleForm.content" placeholder="请输入正文内容（此处未来可集成 Markdown 编辑器）..." class="styled-textarea" rows="8"></textarea>
      </div>

      <div class="form-actions">
        <button class="btn btn-secondary" @click="handlePublish('draft')">保存草稿</button>
        <button class="btn btn-primary" @click="handlePublish('publish')">发布文章</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;
  font-family: sans-serif;
}
.page-header {
  margin-bottom: 20px;
}
.page-header h2 {
  margin: 0 0 8px 0;
  color: #303133;
}
.sub-title {
  margin: 0;
  color: #909399;
  font-size: 14px;
}
.form-card {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
}
.form-item {
  margin-bottom: 20px;
  flex: 1;
}
.form-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #606266;
  font-size: 14px;
}
.form-row {
  display: flex;
  gap: 20px;
}
.styled-input, .styled-select, .styled-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
}
.styled-input:focus, .styled-select:focus, .styled-textarea:focus {
  border-color: #409eff;
  outline: none;
}
.checkbox-group {
  display: flex;
  gap: 15px;
  padding-top: 8px;
}
.checkbox-group label {
  font-weight: normal;
  cursor: pointer;
}
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  border-top: 1px solid #f2f6fc;
  padding-top: 20px;
}
.btn {
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}
.btn-primary {
  background-color: #409eff;
  color: white;
}
.btn-primary:hover { background-color: #66b1ff; }
.btn-secondary {
  background-color: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
}
.btn-secondary:hover { color: #409eff; border-color: #c6e2ff; background-color: #ecf5ff; }
</style>