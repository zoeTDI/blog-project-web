<script setup lang="ts">
  import type { UserMenuOption } from '@/components/userBox';
  import { useUserStore } from '@/store/useUserStore.ts';
  import { ref, watchEffect } from 'vue';
  import type { UserInfo } from '@/store/useUserStore.ts';

  defineEmits(['logout', 'lock']);

  const userStore = useUserStore();
  const userInfo = ref<UserInfo | null>(userStore.getUserInfo());

  const props = withDefaults(
    defineProps<{
      groups: UserMenuOption[][];
    }>(),
    {
      groups: () => [],
    }
  );
  const registerGlobalHotkey = (
    shortcutStr: string,
    callback: (e: KeyboardEvent) => void
  ): Function => {
    const parts = shortcutStr
      .toLowerCase()
      .split('+')
      .map((s) => s.trim());

    const targetModifiers = {
      ctrl: parts.includes('ctrl') || parts.includes('control'),
      alt: parts.includes('alt'),
      shift: parts.includes('shift'),
      meta:
        parts.includes('meta') ||
        parts.includes('cmd') ||
        parts.includes('command'),
    };

    const modifierNames = [
      'ctrl',
      'control',
      'alt',
      'shift',
      'meta',
      'cmd',
      'command',
    ];

    const mainKey = parts.find((p) => !modifierNames.includes(p));
    if (!mainKey) {
      console.warn(`快捷键解析失败: "${shortcutStr}" 没有有效的主按键。`);
      return () => {};
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && activeEl instanceof HTMLElement) {
        if (
          activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.isContentEditable
        ) {
          return;
        }
      }

      const matchModifiers =
        event.ctrlKey === targetModifiers.ctrl &&
        event.altKey === targetModifiers.alt &&
        event.shiftKey === targetModifiers.shift &&
        event.metaKey === targetModifiers.meta;

      const matchKey = event.key.toLowerCase() === mainKey;

      if (matchModifiers && matchKey) {
        event.preventDefault();
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  };
  watchEffect((onCleanup) => {
    const unbindFunctions: Function[] = [];

    // 扁平化遍历所有菜单项
    props.groups.forEach((options) => {
      options.forEach((option) => {
        // 如果配置了快捷键，且有对应的点击事件
        if (option.shortcut && option.onClick) {
          const unbind = registerGlobalHotkey(option.shortcut, () => {
            option.onClick?.(); // 执行配置中的点击方法
          });
          unbindFunctions.push(unbind);
        }
      });
    });

    // 当 groups 改变，或组件被卸载时，自动注销所有已绑定的全局快捷键
    onCleanup(() => {
      unbindFunctions.forEach((unbind) => unbind());
    });
  });
</script>
<template>
  <div class="user-menu-container">
    <!-- 用户信息头部 -->
    <div class="user-profile">
      <div class="avatar-wrapper">
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Panda"
          alt="Admin"
          class="avatar" />
        <!-- 绿色的在线状态小圆点 -->
        <span class="status-dot"></span>
      </div>
      <div class="user-info">
        <div class="name-row">
          <span class="name">{{ userInfo?.nickname || '' }}</span>
        </div>
        <span class="email">{{ userInfo?.email }}</span>
      </div>
    </div>

    <!-- 分割线 -->
    <div class="divider"></div>

    <!-- 菜单第一组：常规导航 -->
    <div
      class="menu-list"
      v-for="options in props.groups">
      <div
        class="menu-item"
        v-for="(option, index) in options"
        @click="option?.onClick"
        :key="index">
        <span
          v-if="option.icon"
          class="icon"
          >{{ option.icon }}</span
        >
        <span class="label">{{ option.label }}</span>
        <span
          v-if="option.shortcut"
          class="shortcut"
          >{{ option.shortcut }}</span
        >
      </div>
    </div>
    <div class="divider"></div>
  </div>
</template>

<style scoped>
  .user-menu-container {
    position: absolute;
    top: calc(100% + 12px);
    right: 0;
    z-index: 1000;

    /* 尺寸与外观还原 */
    width: 240px;
    background-color: var(--color-container-bg); /* 使用全局容器背景色 */
    border: 1px solid var(--color-border); /* 使用全局边框色 */
    border-radius: 8px;
    /* 调整阴影，使其在浅色模式下不要太重，你可以根据实际效果微调 */
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    color: var(--color-text-primary); /* 使用全局主要文本色 */
    font-family: var(--font-text); /* 使用全局字体 */

    /* 允许内部元素有间距但不影响外部圆角 */
    overflow: hidden;
  }

  /* 针对深色模式加深阴影 (可选，如果你的外层结构允许在此处响应) */
  :global(#app.dark) .user-menu-container {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  }

  /* 🌟 防闪烁的隐形桥梁 🌟 */
  .user-menu-container::before {
    content: '';
    position: absolute;
    top: -12px;
    left: 0;
    width: 100%;
    height: 12px;
    background: transparent;
  }

  /* 头部用户信息区域 */
  .user-profile {
    display: flex;
    align-items: center;
    padding: 16px;
    gap: 12px;
  }

  .avatar-wrapper {
    position: relative;
    width: 44px;
    height: 44px;
    flex-shrink: 0;
  }

  .avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    background-color: #fdd8d8; /* 维持原有特定背景色 */
  }

  .status-dot {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 12px;
    height: 12px;
    background-color: var(
      --callout-success-bg,
      #34d399
    ); /* 尝试使用全局成功色，没有则用原色 */
    border: 2px solid var(--color-container-bg); /* 边框颜色与菜单背景一致，实现镂空效果 */
    border-radius: 50%;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow: hidden;
  }

  .name-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .name {
    font-size: 15px;
    font-weight: 600;
    color: var(--color-text-h); /* 使用全局标题文本色 */
  }

  .email {
    font-size: 12px;
    color: var(
      --color-text-primary
    ); /* 使用全局主要文本色，可根据需要调整透明度 */
    opacity: 0.7; /* 稍微降低透明度区分层级 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* 菜单列表区域 */
  .menu-list {
    padding: 4px 0;
  }

  .menu-item {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 14px;
    color: var(--color-text-primary);
  }

  .menu-item:hover {
    background-color: var(--color-bg-hover); /* 使用全局悬浮背景色 */
  }

  /* 占位图标样式 */
  .icon {
    width: 20px;
    margin-right: 12px;
    font-size: 12px;
    color: inherit; /* 继承父级颜色，或者使用 var(--color-text-primary) */
    opacity: 0.7;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .label {
    flex: 1;
  }

  /* 快捷键提示样式 */
  .shortcut {
    font-size: 12px;
    color: var(--color-text-primary);
    opacity: 0.5; /* 降低可见度 */
    letter-spacing: 0.5px;
  }

  /* 分割线 */
  .divider {
    height: 1px;
    background-color: var(--color-border); /* 使用全局边框色 */
    width: 100%;
  }
</style>
