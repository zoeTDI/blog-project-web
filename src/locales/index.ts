// 自动导入语言json文件
const modules = import.meta.glob('./**/*.json', { eager: true });
const messages: Record<string, any> = {};

for (const path in modules) {
  const lang = path.split('/')[2];
  messages[lang] = (modules[path] as any).default;
}

export { messages };
