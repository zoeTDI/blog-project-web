/**
 * 启动无限 debugger 炸弹
 * 一旦检测到控制台打开，会立刻使页面无限卡死在断点处
 */
export function initDebuggerBomb(): void {
  let lastAlertTime = 0;
  // 使用闭包和动态函数构造，增加代码静态分析的破解难度
  const createBomb = function (level: number) {
    function bomb(this: any) {
      try {
        // 1. 记录执行前的时间戳
        const startTime = performance.now();

        // 动态生成 debugger 指令
        const isDebugger = Function(
          'return (function() {}.constructor("debugger")())'
        );
        isDebugger();

        // 2. 记录执行后的时间戳
        const endTime = performance.now();

        // 3. 如果耗时超过 100ms，说明代码在断点处被“卡住”了 = 控制台已打开
        if (endTime - startTime > 100) {
          const now = Date.now();

          // 4. 限制弹窗频率（5秒内只弹一次），给彼此留一丝温柔
          if (now - lastAlertTime > 5000) {
            lastAlertTime = now;

            // 稍微延迟一下弹窗，让用户先看断点，再看弹窗
            setTimeout(() => {
              alert(
                '呜哇！被发现了喵~ (*/ω＼*)\n\n' +
                  '代码酱很害羞的，请不要偷偷看人家的身体（源码）嘛... QAQ\n' +
                  '快把控制台关掉啦，给你捏捏肩~ (っ´ω`c)'
              );
            }, 100);
          }
        }
      } catch (e) {
        // 忽略异常
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
