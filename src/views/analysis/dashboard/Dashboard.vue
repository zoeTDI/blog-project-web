<script setup lang="ts">
  import { CaCard } from '@/components/ca/caCard';
</script>

<template>
  <ca-card class="dashboard-container">
    <h1>控制台概览</h1>

    <div class="kpi-grid">
      <ca-card
        title="总访问量"
        class="kpi-item">
        <p class="stat-value">12,890</p>
      </ca-card>
      <ca-card
        title="待处理任务"
        class="kpi-item">
        <p class="stat-value">8</p>
      </ca-card>
      <ca-card
        title="系统状态"
        class="kpi-item">
        <p class="stat-value text-success">运行正常</p>
      </ca-card>
    </div>

    <div class="main-content">
      <ca-card class="chart-placeholder">
        <template #header>
          <h3 style="position: absolute; margin-top: 20px; margin-left: 20px">
            数据趋势图 (占位)
          </h3>
        </template>
        <div class="placeholder-box"></div>
      </ca-card>

      <ca-card
        title="最近操作记录"
        class="list-placeholder">
        <ul>
          <li>用户 A 更新了配置文件 - 10:00 AM</li>
          <li>系统自动备份完成 - 08:30 AM</li>
          <li>新用户注册 - 07:15 AM</li>
        </ul>
      </ca-card>
    </div>
  </ca-card>
</template>

<style scoped>
  .dashboard-container {
    padding: 20px;
  }
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 20px;
  }
  .stat-value {
    font-size: 24px;
    font-weight: bold;
    margin: 10px 0;
  }
  .placeholder-box {
    height: 200px;
    background: var(--color-bg);
    border: 2px dashed #d9d9d9;
  }
  .text-success {
    color: #52c41a;
  }
</style>
