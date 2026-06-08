<script setup lang="ts">
import { ref } from 'vue'

// 模拟当前登录用户信息
const userProfile = ref({
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin', // 模拟一个默认机器人头像
  nickname: '管理员小张',
  email: 'admin@example.com',
  bio: '保持热爱，奔赴山海。前端开发爱好者，正在努力构建自己的个人博客。',
  oldPassword: '',
  newPassword: ''
})

const handleSave = () => {
  alert(`基本资料已保存！当前昵称: ${userProfile.value.nickname}（此为演示界面，暂无实际后端交互）`)
}
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h2>👤 个人资料设置</h2>
      <p class="sub-title">在这里修改您的公开信息、电子邮箱以及管理员登录密码。</p>
    </div>

    <div class="profile-layout">
      <div class="form-card">
        <h3 class="section-title">基本信息</h3>

        <div class="form-item">
          <label>用户昵称</label>
          <input v-model="userProfile.nickname" type="text" class="styled-input" />
        </div>

        <div class="form-item">
          <label>电子邮箱</label>
          <input v-model="userProfile.email" type="email" class="styled-input" />
        </div>

        <div class="form-item">
          <label>个人简介</label>
          <textarea v-model="userProfile.bio" class="styled-textarea" rows="3"></textarea>
        </div>

        <h3 class="section-title" style="margin-top: 30px;">安全修改</h3>

        <div class="form-item">
          <label>原密码</label>
          <input v-model="userProfile.oldPassword" type="password" placeholder="✍️ 验证身份输入旧密码" class="styled-input" />
        </div>

        <div class="form-item">
          <label>新密码</label>
          <input v-model="userProfile.newPassword" type="password" placeholder="🔒 输入希望变更的新密码" class="styled-input" />
        </div>

        <button class="btn-submit" @click="handleSave">保存变更</button>
      </div>

      <div class="preview-card">
        <h3 class="section-title">头像预览</h3>
        <div class="avatar-wrapper">
          <img :src="userProfile.avatar" alt="Avatar" />
          <button class="upload-hint-btn" @click="alert('触发头像上传操作')">更换头像</button>
        </div>
        <div class="card-info">
          <h4>{{ userProfile.nickname || '未命名用户' }}</h4>
          <p class="role-badge">系统管理员</p>
          <p class="bio-text">{{ userProfile.bio || '这个人很懒，什么都没留下...' }}</p>
        </div>
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
.profile-layout {
  display: flex;
  gap: 24px;
}
.form-card {
  flex: 2;
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
}
.preview-card {
  flex: 1;
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
}
.section-title {
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #f2f6fc;
  color: #303133;
  font-size: 16px;
}
.form-item {
  margin-bottom: 16px;
}
.form-item label {
  display: block;
  margin-bottom: 6px;
  color: #606266;
  font-size: 14px;
}
.styled-input, .styled-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-sizing: border-box;
}
.btn-submit {
  margin-top: 12px;
  padding: 10px 24px;
  background-color: #67c23a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-submit:hover { background-color: #85ce61; }

/* 右侧头像样式 */
.avatar-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  margin-bottom: 16px;
}
.avatar-wrapper img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #f0f2f5;
  border: 2px solid #ebeef5;
}
.upload-hint-btn {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  font-size: 11px;
  padding: 4px 0;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
  cursor: pointer;
}
.card-info {
  text-align: center;
  width: 100%;
}
.card-info h4 { margin: 8px 0; color: #303133; }
.role-badge {
  display: inline-block;
  background-color: #ecf5ff;
  color: #409eff;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin: 0 0 12px 0;
}
.bio-text {
  font-size: 13px;
  color: #909399;
  line-height: 1.5;
  background: #f8f9fa;
  padding: 10px;
  border-radius: 6px;
  margin: 0;
}
</style>