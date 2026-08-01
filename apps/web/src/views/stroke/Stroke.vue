<script setup lang="ts">
  import { CaCalendar, CaDrawer, type CaDrawerExpose } from '@caldm/ui';
  import { onMounted, ref } from 'vue';
  import { mockApiFetch } from '@/utils/mock.ts';
  import { useCSSNamespace } from '@caldm/hook';
  export interface TodoItem {
    id: number;
    title?: string;
    context: string;
    color?: string;
  }

  const mockData: Record<string, TodoItem[]> = {
    '2026-07-18': [
      {
        id: 2026071801,
        context: '与后端确认用户权限校验 API 的参数细节',
        title: '接口对接',
        color: '#3B82F633',
      },
      {
        id: 2026071802,
        context: '与后端确认用户权限校验 API 的参数细节',
        title: '接口对接',
        color: '#EF444433',
      },
    ],
    '2026-07-20': [
      {
        id: 2026072001,
        context: '补充完善新增组件的使用说明与示例代码',
        title: '文档更新',
        color: '#3B82F633',
      },
      {
        id: 2026072002,
        context: '完成本周前端项目进度总结并发送给团队负责人',
        title: '周报编写',
      },
    ],
    '2026-07-21': [
      {
        id: 2026072101,
        context: '重构全局状态管理逻辑，降低非必要的组件渲染',
        title: '架构优化',
        color: '#A855F733',
      },
    ],
    '2026-07-22': [
      {
        id: 2026072201,
        context: '排查并修复线上反馈的表格排序错乱 Bug',
        title: '缺陷修复',
        color: '#22C55E33',
      },
      {
        id: 2026072202,
        context: '重构全局状态管理逻辑，降低非必要的组件渲染',
        title: '架构优化',
        color: '#3B82F633',
      },
      {
        id: 2026072203,
        context: '准备下周团队内部关于前端性能优化的 PPT',
        title: '技术分享',
        color: '#F59E0B33',
      },
    ],
    '2026-07-23': [
      { id: 2026072301, context: '准备下周团队内部关于前端性能优化的 PPT' },
      {
        id: 2026072302,
        context: '补充完善新增组件的使用说明与示例代码',
        title: '文档更新',
        color: '#F59E0B33',
      },
      {
        id: 2026072303,
        context: '与后端确认用户权限校验 API 的参数细节',
        title: '接口对接',
        color: '#3B82F633',
      },
    ],
    '2026-07-24': [
      {
        id: 2026072401,
        context: '补充完善新增组件的使用说明与示例代码',
        title: '文档更新',
        color: '#EF444433',
      },
    ],
    '2026-07-25': [
      {
        id: 2026072501,
        context: '准备下周团队内部关于前端性能优化的 PPT',
        title: '技术分享',
        color: '#EF444433',
      },
      {
        id: 2026072502,
        context: '与后端确认用户权限校验 API 的参数细节',
        title: '接口对接',
        color: '#3B82F633',
      },
    ],
    '2026-07-26': [
      {
        id: 2026072601,
        context: '完成本周前端项目进度总结并发送给团队负责人',
        title: '周报编写',
        color: '#22C55E33',
      },
      {
        id: 2026072602,
        context: '准备下周团队内部关于前端性能优化的 PPT',
        title: '技术分享',
        color: '#A855F733',
      },
    ],
    '2026-07-27': [
      {
        id: 2026072701,
        context: '完成本周前端项目进度总结并发送给团队负责人',
        title: '周报编写',
      },
      {
        id: 2026072702,
        context: '补充完善新增组件的使用说明与示例代码',
        color: '#EF444433',
      },
    ],
    '2026-07-28': [
      {
        id: 2026072801,
        context: '完成本周前端项目进度总结并发送给团队负责人',
        title: '周报编写',
        color: '#3B82F633',
      },
    ],
    '2026-07-29': [
      {
        id: 2026072901,
        context: '与后端确认用户权限校验 API 的参数细节',
        title: '接口对接',
      },
      {
        id: 2026072902,
        context: '完成本周前端项目进度总结并发送给团队负责人',
        title: '周报编写',
        color: '#F59E0B33',
      },
    ],
    '2026-07-30': [
      {
        id: 2026073001,
        context: '完成本周前端项目进度总结并发送给团队负责人',
        title: '周报编写',
        color: '#A855F733',
      },
    ],
    '2026-08-2': [
      {
        id: 2026080201,
        context: '与后端确认用户权限校验 API 的参数细节',
        title: '接口对接',
        color: '#F59E0B33',
      },
      {
        id: 2026080202,
        context: '排查并修复线上反馈的表格排序错乱 Bug',
        title: '缺陷修复',
        color: '#F59E0B33',
      },
    ],
    '2026-08-3': [
      {
        id: 2026080301,
        context: '排查并修复线上反馈的表格排序错乱 Bug',
        title: '缺陷修复',
        color: '#F59E0B33',
      },
      {
        id: 2026080302,
        context: '准备下周团队内部关于前端性能优化的 PPT',
        color: '#3B82F633',
      },
    ],
    '2026-08-5': [
      {
        id: 2026080501,
        context: '重构全局状态管理逻辑，降低非必要的组件渲染',
        title: '架构优化',
        color: '#22C55E33',
      },
      {
        id: 2026080502,
        context: '重构全局状态管理逻辑，降低非必要的组件渲染',
        title: '架构优化',
        color: '#EF444433',
      },
      {
        id: 2026080503,
        context: '完成本周前端项目进度总结并发送给团队负责人',
        title: '周报编写',
        color: '#3B82F633',
      },
    ],
    '2026-08-6': [
      {
        id: 2026080601,
        context: '排查并修复线上反馈的表格排序错乱 Bug',
        title: '缺陷修复',
        color: '#EF444433',
      },
      {
        id: 2026080602,
        context: '排查并修复线上反馈的表格排序错乱 Bug',
        title: '缺陷修复',
      },
      {
        id: 2026080603,
        context: '准备下周团队内部关于前端性能优化的 PPT',
        color: '#EF444433',
      },
    ],
    '2026-08-8': [
      {
        id: 2026080801,
        context: '排查并修复线上反馈的表格排序错乱 Bug',
        title: '缺陷修复',
        color: '#A855F733',
      },
      {
        id: 2026080802,
        context: '重构全局状态管理逻辑，降低非必要的组件渲染',
        title: '架构优化',
        color: '#22C55E33',
      },
    ],
    '2026-08-9': [
      {
        id: 2026080901,
        context: '补充完善新增组件的使用说明与示例代码',
        title: '文档更新',
        color: '#3B82F633',
      },
    ],
    '2026-08-10': [
      {
        id: 2026081001,
        context: '重构全局状态管理逻辑，降低非必要的组件渲染',
        title: '架构优化',
        color: '#F59E0B33',
      },
      {
        id: 2026081002,
        context: '与后端确认用户权限校验 API 的参数细节',
        title: '接口对接',
        color: '#EF444433',
      },
      {
        id: 2026081003,
        context: '完成本周前端项目进度总结并发送给团队负责人',
        color: '#A855F733',
      },
    ],
    '2026-08-13': [
      {
        id: 2026081301,
        context: '重构全局状态管理逻辑，降低非必要的组件渲染',
        title: '架构优化',
        color: '#A855F733',
      },
    ],
    '2026-08-14': [
      {
        id: 2026081401,
        context: '重构全局状态管理逻辑，降低非必要的组件渲染',
        title: '架构优化',
        color: '#F59E0B33',
      },
      {
        id: 2026081402,
        context: '准备下周团队内部关于前端性能优化的 PPT',
        title: '技术分享',
      },
      {
        id: 2026081403,
        context: '完成本周前端项目进度总结并发送给团队负责人',
        title: '周报编写',
        color: '#3B82F633',
      },
    ],
  };

  const ns = useCSSNamespace('stroke');

  const todoData = ref<Record<string, TodoItem[]>>({});

  const drawerRef = ref<CaDrawerExpose | null>(null);

  onMounted(async () => {
    todoData.value = await mockApiFetch(mockData, 1000);
  });
</script>

<template>
  <div :class="ns.b()">
    <CaCalendar :data="todoData">
      <template
        v-for="(dataContext, datestamp) in todoData"
        :key="datestamp"
        #[datestamp]="{ dataItem }">
        <div
          :class="ns.e('todo-info-box')"
          v-if="!!dataItem">
          <div
            :class="ns.e('todo-item')"
            v-for="item in dataItem"
            :key="item.id"
            :style="{ backgroundColor: item?.color ? item.color : 'unset' }">
            <span
              :class="ns.e('todo-title')"
              v-if="item.title"
              >{{ item.title }}</span
            >
            <span :class="ns.e('todo-context')">{{ item.context }}</span>
          </div>
        </div>
      </template>
    </CaCalendar>
    <CaDrawer ref="drawerRef" />
  </div>
</template>

<style scoped>
  .ca-stroke {
    width: 90%;
    padding: var(--content-padding-M);
    margin: auto;
  }

  .ca-stroke__todo-info-box {
    padding: 8px;
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    row-gap: 4px;
    justify-content: center;
    align-items: flex-start;
  }

  .ca-stroke__todo-item {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    border-radius: 4px;
    padding: 2px;
  }

  .ca-stroke__todo-title {
    color: var(--color-text-h);
    font-weight: bold;
    margin-right: 8px;
  }

  .ca-stroke__todo-context {
    color: var(--color-text-primary);
  }
</style>
