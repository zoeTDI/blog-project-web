<script setup lang="ts">
  import { ref } from 'vue';

  // 模拟标签数据列表
  const tags = ref([
    { id: 1, name: 'Vue3', count: 12, color: '#42b883' },
    { id: 2, name: 'TypeScript', count: 8, color: '#3178c6' },
    { id: 3, name: '前端开发', count: 25, color: '#ff9800' },
    { id: 4, name: '随笔', count: 5, color: '#67c23a' },
  ]);

  const newTagName = ref('');

  // 模拟添加标签
  const addTag = () => {
    if (!newTagName.value.trim()) return;
    tags.value.push({
      id: Date.now(),
      name: newTagName.value,
      count: 0,
      color: '#909399',
    });
    newTagName.value = '';
  };

  // 模拟删除
  const deleteTag = (name: string) => {
    alert(`触发删除：标签 [${name}]（此为演示界面，暂无实际后端交互）`);
  };

  const handleEdit = () => window.alert('触发修改操作');
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h2>🏷️ 标签管理</h2>
      <p class="sub-title">
        管理博客文章的微观标签，支持快速创建和查看标签关联的文章数量。
      </p>
    </div>

    <div class="content-card">
      <div class="action-bar">
        <input
          v-model="newTagName"
          type="text"
          placeholder="输入新标签名称..."
          class="styled-input"
          @keyup.enter="addTag" />
        <button
          class="btn btn-primary"
          @click="addTag">
          🔍 快速添加
        </button>
      </div>

      <table class="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>标签名称</th>
            <th>代表色</th>
            <th>文章关联数</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="tag in tags"
            :key="tag.id">
            <td>{{ tag.id }}</td>
            <td>
              <span
                class="tag-badge"
                :style="{ backgroundColor: tag.color }"
                >{{ tag.name }}</span
              >
            </td>
            <td>
              <code>{{ tag.color }}</code>
            </td>
            <td>
              <strong>{{ tag.count }}</strong> 篇
            </td>
            <td>
              <button
                class="text-btn edit-btn"
                @click="handleEdit">
                编辑
              </button>
              <button
                class="text-btn delete-btn"
                @click="deleteTag(tag.name)">
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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
  .content-card {
    background: #fff;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  }
  .action-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    max-width: 400px;
  }
  .styled-input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
  .btn {
    padding: 8px 16px;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    white-space: nowrap;
  }
  .styled-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 14px;
  }
  .styled-table th,
  .styled-table td {
    padding: 12px;
    border-bottom: 1px solid #ebeef5;
  }
  .styled-table th {
    background-color: #f5f7fa;
    color: #909399;
  }
  .tag-badge {
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
  }
  .text-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0 4px;
    font-size: 13px;
  }
  .edit-btn {
    color: #409eff;
  }
  .delete-btn {
    color: #f56c6c;
    margin-left: 8px;
  }
</style>
