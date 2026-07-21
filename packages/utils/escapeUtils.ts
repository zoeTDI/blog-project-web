/**
 * HTML转义函数
 * @param str 待转义的字符串
 */
export const escapeHTML = (str: string):string => {
    return str.replace(/[&<>"']/g, (m) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[m] || m));
}