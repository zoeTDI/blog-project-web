<script setup lang="ts">
  import { BellIcon, EnvelopeIcon } from '@heroicons/vue/24/outline';
  import MessageList from './MessageList.vue';
  import UserMenu from './UserMenu.vue';
  import { preferences } from '@/core/preferences/index.ts';
  import defaultAvatar from '@/assets/avatar.svg';
  import { onMounted, ref } from 'vue';
  import { useDebounceFn } from '@/hooks/useDebounceFn.ts';
  import {
    type MessageItem,
    MessageSource,
    type UserMenuOption,
  } from '@/components/userBox';
  import { mockApiFetch } from '@/utils/mock.ts';
  import { useUserStore } from '@/store/useUserStore.ts';
  import { useRoute, useRouter } from 'vue-router';
  import { ROUTER_NAMES } from '@/router/routerNames.ts';

  const mockMessages: MessageItem[] = [
    {
      id: 1,
      type: MessageSource.SYSTEM,
      isRead: false,
      content: '您的个人资料已成功更新，点击查看详情。',
      title: '系统通知',
      timestamp: new Date(),
      icon: BellIcon,
    },
    {
      id: 2,
      type: MessageSource.USER,
      isRead: true,
      content: '项目进展如何？我们需要在明天前确认需求。',
      senderName: '张三',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      timestamp: new Date(),
    },
    {
      id: 3,
      type: MessageSource.SYSTEM,
      isRead: false,
      content: '检测到一次新的登录尝试，如果不是本人，请尽快修改密码。',
      title: '安全警报',
      timestamp: new Date(),
      icon: EnvelopeIcon,
    },
    {
      id: 4,
      type: MessageSource.SYSTEM,
      isRead: false,
      content: '检测到一次新的登录尝试，如果不是本人，请尽快修改密码。',
      title: '安全警报',
      timestamp: new Date(),
      icon: EnvelopeIcon,
    },
    {
      id: 5,
      type: MessageSource.SYSTEM,
      isRead: false,
      content: '检测到一次新的登录尝试，如果不是本人，请尽快修改密码。',
      title: '安全警报',
      timestamp: new Date(),
      icon: EnvelopeIcon,
    },
    {
      id: 6,
      type: MessageSource.SYSTEM,
      isRead: false,
      content: '检测到一次新的登录尝试，如果不是本人，请尽快修改密码。',
      title: '安全警报',
      timestamp: new Date(),
      icon: EnvelopeIcon,
    },
  ];

  const router = useRouter();
  const route = useRoute();
  const userStore = useUserStore();
  const avatarUrl = preferences.app.defaultAvatar;
  let hoverTimer: ReturnType<typeof setTimeout> | null = null;
  // 消息队列的显示状态
  const isMessageVisible = ref<boolean>(false);
  const messages = ref<MessageItem[]>([]);
  // 用户菜单的显示状态
  const isUserMenuVisible = ref<boolean>(false);
  let userMenuTimer: ReturnType<typeof setTimeout> | null = null;
  const pendingReadIds = new Set<string | number>();
  // 用户菜单配置
  const userMenuGroups = ref<UserMenuOption[][]>([
    [
      {
        label: '个人中心',
      },
      {
        label: '文档',
      },
      { label: 'Github' },
      { label: '问题 & 帮助' },
    ],
    [
      {
        label: '退出登录',
        shortcut: 'Alt + Q',
        onClick: () => {
          userStore.logout();
          router.push({ name: ROUTER_NAMES.LOGIN, query: { to: route.path } });
        },
      },
    ],
  ]);

  /**
   * 向后端更新消息状态
   */
  const syncToBackend = useDebounceFn(async () => {
    const ids = Array.from(pendingReadIds);
    if (ids.length === 0) return;
    console.log('向后端提交已读 ID:', ids);
    // await mockApiFetch(..., 0);
    pendingReadIds.clear();
  }, 1000);
  /**
   * 处理子组件传来的消息已读事件
   * @param id
   */
  const handleMarkRead = (id: string | number) => {
    const msg = messages.value.find((m) => m.id === id);
    if (msg) msg.isRead = true;
    pendingReadIds.add(id);
    syncToBackend();
  };
  /**
   * 显示消息列表
   */
  const showMessage = () => {
    // 鼠标进入时，立刻清除正在倒计时的隐藏操作
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      hoverTimer = null;
    }
    isMessageVisible.value = true;
    console.log('show');
  };
  /**
   * 隐藏消息列表
   */
  const hideMessage = () => {
    // 鼠标离开时，不要立刻隐藏，而是等 300ms
    // 如果这 300ms 内鼠标又进来了，showMessage 会把这个定时器干掉
    hoverTimer = setTimeout(() => {
      isMessageVisible.value = false;
      console.log('hide');
    }, 300);
  };
  /**
   * 显示用户菜单
   */
  const showUserMenu = () => {
    if (userMenuTimer) {
      clearTimeout(userMenuTimer);
      userMenuTimer = null;
    }
    isUserMenuVisible.value = true;
  };

  /**
   * 隐藏用户菜单
   */
  const hideUserMenu = () => {
    userMenuTimer = setTimeout(() => {
      isUserMenuVisible.value = false;
    }, 300);
  };
  /**
   * 处理用户头像加载失败。失败时改为使用默认头像
   * @param event
   */
  const handleImageError = (event: Event) => {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = defaultAvatar;
  };
  /**
   * 加载用户消息队列
   */
  const loadMessages = async () => {
    try {
      const data = await mockApiFetch<MessageItem[]>(mockMessages, 1000);
      messages.value = data;
    } catch (error) {
      console.error('加载消息失败', error);
    }
  };
  onMounted(async () => {
    await loadMessages();
  });
</script>

<template>
  <div class="user-box">
    <div
      class="action-item message-list"
      @mouseenter="showMessage"
      @mouseleave="hideMessage">
      <BellIcon class="icon" />
      <MessageList
        v-show="isMessageVisible"
        @mark-read="handleMarkRead"
        :messages="messages" />
    </div>

    <div
      class="action-item user-avatar"
      @mouseenter="showUserMenu"
      @mouseleave="hideUserMenu">
      <img
        :src="avatarUrl"
        alt="User Avatar"
        class="avatar-img"
        @error="handleImageError" />
      <UserMenu
        v-show="isUserMenuVisible"
        :groups="userMenuGroups" />
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
    width: 20px;
    height: 20px;
    color: #666;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
  }

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    border: 1px solid var(--color-border);
  }
</style>
