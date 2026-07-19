/**
 * Lorem Picsum 工具函数集
 * 官网: https://picsum.photos/
 */

const BASE_URL = 'https://picsum.photos';

/**
 * 生成一个随机的字符串作为 Seed（确保每次请求图片不同）
 */
const getRandomSeed = () => {
    return `seed=${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * 方法一：返回指定分辨率的图片 URL
 * @param width 宽度 (默认 800)
 * @param height 高度 (默认 600)
 */
export const getImageBySize = (width: number = 800, height: number = 600): string => {
    return `${BASE_URL}/${width}/${height}?${getRandomSeed()}`;
};

/**
 * 方法二：返回指定宽高比的图片 URL
 * @param ratio 宽高比 (默认 '16:9')，支持 '16:9', '4:3', '1:1', '9:16' 等
 * @param baseWidth 基准宽度 (默认 800)，用于计算高度
 */
export const getImageByRatio = (ratio: string = '16:9', baseWidth: number = 800): string => {
    const [w, h] = ratio.split(':').map(Number);
    if (!w || !h) throw new Error('Invalid ratio format. Use "16:9" etc.');

    const height = Math.round(baseWidth / w * h);
    return `${BASE_URL}/${baseWidth}/${height}?${getRandomSeed()}`;
};

/**
 * 方法三：返回多张指定分辨率的图片 URL
 * @param count 数量 (默认 1)
 * @param width 宽度 (默认 800)
 * @param height 高度 (默认 600)
 */
export const getImagesBySize = (count: number = 1, width: number = 800, height: number = 600): string[] => {
    return Array.from({ length: count }, () => getImageBySize(width, height));
};

/**
 * 方法四：返回多张指定宽高比的图片 URL
 * @param count 数量 (默认 1)
 * @param ratio 宽高比 (默认 '16:9')
 * @param baseWidth 基准宽度 (默认 800)
 */
export const getImagesByRatio = (count: number = 1, ratio: string = '16:9', baseWidth: number = 800): string[] => {
    return Array.from({ length: count }, () => getImageByRatio(ratio, baseWidth));
};

/**
 * 方法五：根据常见场景返回预设分辨率的图片 URL 集合
 * 这是一个对象，包含多种场景的方法
 */
export const ImagePresets = {
    /**
     * 获取文章封面 (16:9)
     * @param width 宽度 (默认 1200)
     */
    articleCover: (width: number = 1200) => getImageByRatio('16:9', width),

    /**
     * 获取用户头像 (1:1)
     * @param size 边长 (默认 100)
     */
    avatar: (size: number = 100) => getImageBySize(size, size),

    /**
     * 获取卡片图片 (4:3)
     * @param width 宽度 (默认 400)
     */
    cardImage: (width: number = 400) => getImageByRatio('4:3', width),

    /**
     * 获取全屏背景 (16:9 大尺寸)
     * @param width 宽度 (默认 1920)
     */
    fullScreenBg: (width: number = 1920) => getImageByRatio('16:9', width),

    /**
     * 获取手机竖屏图 (9:16)
     * @param width 宽度 (默认 375)
     */
    mobileStory: (width: number = 375) => getImageByRatio('9:16', width),

    /**
     * 获取缩略图 (小尺寸)
     * @param size 边长 (默认 50)
     */
    thumbnail: (size: number = 50) => getImageBySize(size, size),
};

// 导出默认对象，方便整体导入
export default {
    getImageBySize,
    getImageByRatio,
    getImagesBySize,
    getImagesByRatio,
    ...ImagePresets,
};