import {defineStore} from "pinia";
import {ref} from "vue";

export const useLoadingStore = defineStore('loading', () => {
    // 1. isVisible 控制 LoadingBar 组件是否在 DOM 中存在
    const isVisible = ref(false);
    // 2. isSwitching 控制页面内容是否被 v-show 隐藏（拦截视觉跳转）
    const isSwitching = ref(false);
    // 3. 具体的进度百分比
    const progress = ref(0);

    const startLoading = () => {
        isVisible.value = true;
        isSwitching.value = true;
        progress.value = 10; // 初始进度，给用户即时反馈
    };

    const endLoading = async () => {
        // 瞬间冲到满格
        progress.value = 100;

        // 核心：延迟 100ms 确保用户肉眼能捕捉到“加载完成”的状态
        await new Promise(r => setTimeout(r, 100));

        // 允许页面组件显示出来（切断拦截）
        isSwitching.value = false;

        // 进度条本身淡出
        isVisible.value = false;

        // 彻底结束后重置进度，为下一次跳转做准备
        setTimeout(() => {
            progress.value = 0;
        }, 400); // 略长于 CSS 的 Transition 时间
    };

    return {
        isVisible,
        isSwitching,
        progress,
        startLoading,
        endLoading
    };
});