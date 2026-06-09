import type { SupportLanguageOption, TimezoneOption } from "@/core/preferences";

export class TimezoneUtils {
  /**
   * 格式化日期为特定时区的字符串
   * 适用于展示层 (UI)
   */
  static formatInZone(
    date: Date,
    timeZone: TimezoneOption,
    locale: SupportLanguageOption = 'zh-CN'
  ): string {
    return new Intl.DateTimeFormat(locale, {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  }

  /**
   * 获取某个特定时区的当前日期对象
   * 逻辑：通过解析 Intl 格式化后的字符串来创建一个新的日期对象
   * 解决：避免手动计算偏移量带来的夏令时（DST）风险
   */
  static getDateInZone(timeZone: TimezoneOption): Date {
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    // 将格式化后的字符串转换回 Date 对象
    return new Date(dtf.format(new Date()));
  }

  /**
   * 获取指定时区与 UTC 的偏移分钟数
   */
  static getOffsetMinutes(timeZone: TimezoneOption): number {
    const date = new Date();
    const localizedString = date.toLocaleString('en-US', { timeZone });
    return (new Date(localizedString).getTime() - date.getTime()) / 60000;
  }
}