<script setup lang="ts">
  import { CaCalendar, CaDrawer, type CaDrawerExpose } from '@caldm/ui';
  import { onMounted, ref } from 'vue';
  import { mockApiFetch } from '@/utils/mock.ts';
  import { useCSSNamespace } from '@caldm/hook';
  import { generateData } from '@/views/stroke/mock.ts';
  export interface TodoItem {
    id: number;
    title?: string;
    context: string;
    color?: string;
  }

  const ns = useCSSNamespace('stroke');

  const cachedKey = new Set();
  const todoData = ref<Record<string, TodoItem[]>>({});
  const drawerTitle = ref<string>('');
  const drawerData = ref<TodoItem[]>([]);
  const drawerRef = ref<CaDrawerExpose | null>(null);
  const isLoading = ref<boolean>(false);

  const fetchTodoData = async (option: {
    year: number;
    month: number;
  }): Promise<Record<string, TodoItem[]>> => {
    return await mockApiFetch(generateData(option.year, option.month));
  };

  const handleClick = (datestamp: string, d: TodoItem[] | undefined) => {
    if (!d || !drawerRef.value) return;
    drawerTitle.value = datestamp;
    drawerData.value = d;
    drawerRef.value.open();
  };

  const getDatestamp = (d: Date): string => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getYMstamp = (d: Date): string => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  const handleChange = async (curDate: Date) => {
    try {
      isLoading.value = true;

      // 预计算各月份日期
      const curKey = getYMstamp(curDate);
      const prevDate = new Date(curDate);
      prevDate.setMonth(prevDate.getMonth() - 1);
      const nextDate = new Date(curDate);
      nextDate.setMonth(nextDate.getMonth() + 1);
      const prevKey = getYMstamp(prevDate);
      const nextKey = getYMstamp(nextDate);

      // 收集需要请求的月份信息（保持原有缓存判断逻辑）
      const monthsToFetch: { year: number; month: number; key: string }[] = [];

      if (!cachedKey.has(curKey)) {
        console.log('发起请求：', curKey);
        monthsToFetch.push({
          year: curDate.getFullYear(),
          month: curDate.getMonth() + 1,
          key: curKey,
        });
      } else {
        console.log('命中缓存：', curKey);
      }

      if (!cachedKey.has(prevKey)) {
        console.log('发起请求：', prevKey);
        monthsToFetch.push({
          year: prevDate.getFullYear(),
          month: prevDate.getMonth() + 1,
          key: prevKey,
        });
      } else {
        console.log('命中缓存：', prevKey);
      }

      if (!cachedKey.has(nextKey)) {
        console.log('发起请求：', nextKey);
        monthsToFetch.push({
          year: nextDate.getFullYear(),
          month: nextDate.getMonth() + 1,
          key: nextKey,
        });
      } else {
        console.log('命中缓存：', nextKey);
      }

      // 并发请求所有未缓存的月份
      if (monthsToFetch.length > 0) {
        const promises = monthsToFetch.map(({ year, month }) =>
          fetchTodoData({ year, month })
        );
        const results = await Promise.all(promises);
        // 统一合并数据并更新缓存
        results.forEach((data, index) => {
          const key = monthsToFetch[index].key;
          todoData.value = { ...todoData.value, ...data };
          cachedKey.add(key);
        });
      }
    } catch (e) {
      console.log('🚀 ~ handleChange ~ e: ', e);
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(async () => {
    await handleChange(new Date());
  });
</script>

<template>
  <div :class="ns.b()">
    <CaCalendar
      :data="todoData"
      :loading="isLoading"
      @click="handleClick"
      @change="handleChange">
      <template
        v-for="(dataContext, datestamp) in todoData"
        :key="datestamp"
        #[datestamp]="{ dataItem }">
        <div
          :class="ns.e('todo-info-box')"
          v-if="!!dataItem">
          <div
            :class="ns.e('todo-item')"
            v-for="item in dataItem.slice(0, 3)"
            :key="item.id"
            :style="{ backgroundColor: item?.color ? item.color : 'unset' }">
            <span
              :class="ns.e('todo-title')"
              v-if="item.title"
              >{{ item.title }}</span
            >
            <span :class="ns.e('todo-context')">{{ item.context }}</span>
          </div>
          <div
            :class="ns.e('more')"
            v-if="dataItem.length - 2 > 0">
            更多+ {{ dataItem.length - 2 }}
          </div>
        </div>
      </template>
    </CaCalendar>
    <CaDrawer
      ref="drawerRef"
      :custom-size="380"
      :placement="'right'">
      <template #header>
        <div :class="ns.e('drawer-title')">
          {{ drawerTitle }}
        </div>
      </template>
      <template #default>
        <div
          :class="ns.e('todo-detail-item')"
          v-for="item in drawerData"
          :key="item.id"
          :style="{ backgroundColor: item?.color ? item.color : 'unset' }">
          <div
            :class="ns.e('todo-detail-item-title')"
            v-if="item?.title">
            {{ item.title }}
          </div>
          <div :class="ns.e('todo-detail-item-context')">
            {{ item.context }}
          </div>
        </div>
      </template>
    </CaDrawer>
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
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    row-gap: 4px;
    justify-content: flex-start;
    align-items: flex-start;
    cursor: pointer;
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

  .ca-stroke__more {
    font-size: 14px;
    color: color-mix(in srgb, var(--color-text-primary) 80%, transparent);
    cursor: pointer;
  }

  .ca-stroke__drawer-title {
    font-size: 20px;
    font-weight: 500;
    color: #1a1a1a;
    letter-spacing: 0.5px;
  }

  .ca-stroke__todo-detail-item {
    display: flex;
    flex-direction: column;
    padding: 12px 8px;
    border-bottom: 1px solid #f5f5f5;
    border-radius: 4px;
    margin-bottom: 16px;
  }

  .ca-stroke__todo-detail-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  .ca-stroke__todo-detail-item-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    line-height: 1.5;
    margin-bottom: 4px;
  }

  .ca-stroke__todo-detail-item-context {
    font-size: 14px;
    font-weight: 400;
    color: #4a4a4a;
    line-height: 1.6;
  }
</style>
