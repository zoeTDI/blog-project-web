export type ShortcutKey =
  | 'F12'
  | 'Ctrl+U'
  | 'Ctrl+Shift+C'
  | 'Ctrl+Shift+I'
  | 'Ctrl+Shift+J'
  | 'Meta+Shift+I' // Mac Command 键
  | string;

export const disabledKeys: ShortcutKey[] = [
  'F12',
  'Ctrl+U', // 禁用查看源码
  'Ctrl+Shift+C', // 禁止在页面上选择元素
  'Ctrl+Shift+I', // 禁用开发者工具 (Windows)
  'Ctrl+Shift+J', // 禁用控制台 (Windows)
  'Meta+Shift+I', // 禁用开发者工具 (Mac)
];

/**
 * 动态禁用指定的快捷键
 * @param shortcuts 快捷键字符串数组
 */
export function initDisableShortcuts(shortcuts: ShortcutKey[]): void {
  const handleKeyDown = (event: KeyboardEvent) => {
    // 将当前用户的按键操作转化为标准的规范化字符串，例如 "ctrl+shift+i"
    const pressedKeys: string[] = [];

    if (event.ctrlKey) pressedKeys.push('ctrl');
    if (event.metaKey) pressedKeys.push('meta'); // Mac Command 键
    if (event.shiftKey) pressedKeys.push('shift');
    if (event.altKey) pressedKeys.push('alt');

    // 把实际按下的键（如 'i', 'f12'）转为小写加入队列
    // 注意：event.key 在配合 Shift 时大写字母会变成 'I'，所以统一转小写
    const mainKey = event.key.toLowerCase();

    // 如果主键不是控制键本身，才加进去
    if (!['control', 'meta', 'shift', 'alt'].includes(mainKey)) {
      pressedKeys.push(mainKey);
    }

    const pressedString = pressedKeys.join('+');

    // 扫描配置数组
    for (const shortcut of shortcuts) {
      // 将配置的字符串（如 'Ctrl+Shift+I'）转化为小写标准格式：'ctrl+shift+i'
      const targetString = shortcut.toLowerCase();

      // 特殊兼容处理：如果配置了 'ctrl'，在 Mac 上通常也要兼容 'meta'
      const isMacMatch =
        targetString.includes('ctrl') &&
        pressedString.includes('meta') &&
        targetString.replace('ctrl', 'meta') === pressedString;

      // 精确匹配成功，拦截事件
      if (pressedString === targetString || isMacMatch) {
        event.preventDefault();
        event.stopPropagation();
        break; // 匹配到一个就足够了
      }
    }
  };

  // 绑定全局事件
  window.addEventListener('keydown', handleKeyDown, true); // 使用事件捕获，确保尽早拦截
}

/**
 * 动态禁用鼠标右键（支持白名单排除）
 * @param excludeSelector 可选，排除的选择器（例如 '[data-allow-context]' 或 '.custom-menu'）
 */
export function disableContextMenu(excludeSelector?: string): void {
  window.addEventListener('contextmenu', (event) => {
    const target = event.target as HTMLElement;
    // 如果传入了白名单选择器，且当前右键点击的元素（或其任意祖先元素）匹配该选择器
    if (excludeSelector && target.closest(excludeSelector)) {
      // 放行，不执行 preventDefault()，让你的自定义二级菜单逻辑正常触发
      return;
    }

    // 否则，一律拦截（禁用原生右键菜单）
    event.preventDefault();
  });
}

/**
 * 禁用调试快捷键和右键菜单
 */
export function disableDefaultConfig() {
  disableContextMenu();
  initDisableShortcuts(disabledKeys);
}
