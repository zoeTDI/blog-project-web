/**
 * 启动无限 debugger 炸弹
 * 一旦检测到控制台打开，会立刻使页面无限卡死在断点处
 */
export function initDebuggerBomb(): void {
  // 使用闭包和动态函数构造，增加代码静态分析的破解难度
  const createBomb = function (level: number) {
    function bomb(this: any) {
      try {
        // 动态生成 debugger 指令
        const isDebugger = Function(
          'return (function() {}.constructor("debugger")())'
        );
        isDebugger();
      } catch (e) {
        // 忽略异常，防止因为浏览器安全策略导致外层应用崩溃
      }
    }
    if (typeof level === 'number') {
      bomb();
    }
  };

  // 每 200 毫秒狂轰滥炸一次
  setInterval(() => {
    createBomb(0);
  }, 200);
}
