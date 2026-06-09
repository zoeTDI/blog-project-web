<script setup lang="ts">
import { BellIcon } from '@heroicons/vue/24/outline';
import MessageList from './MessageList.vue';
import UserMenu from './UserMenu.vue';
import { preferences } from '@/core/preferences/index.ts';
import defaultAvatar from '@/assets/avatar.svg'

const avatarUrl = preferences.app.defaultAvatar;

const handleImageError = (event: Event) => {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = defaultAvatar;
};
</script>

<template>
  <div class="user-box">
    <div class="action-item">
      <BellIcon class="icon" />
      <MessageList />
    </div>

    <div class="action-item user-avatar">
      <img :src="avatarUrl" alt="User Avatar" class="avatar-img" @error="handleImageError" />
      <UserMenu />
    </div>
  </div>
</template>

<style scoped>
.user-box {
  display: flex;
  align-items: center;
  gap: 16px;
}
.action-item {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.icon {
  width: 24px;
  height: 24px;
  color: #666;
}

.user-avatar {
  width: 32px;
  height: 32px;
  overflow: hidden;
  border-radius: 50%;
  border: 1px solid #ddd;
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>