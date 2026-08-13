import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { type CSSProperties, ref } from 'vue';
import { CaTable, CaTableColumn } from '../index.ts';

const meta: Meta<typeof CaTable> = {
  title: 'Component/Table',
  component: CaTable,
  tags: ['autodocs'],
  argTypes: {
    maxHeight: {
      control: 'number',
    },
    stripe: {
      control: 'boolean',
    },
    border: {
      control: 'boolean',
    },
    highCurrent: {
      control: 'boolean',
    },
    size: {
      control: 'select',
      options: ['S', 'M', 'L'],
    },
  },
  args: {
    data: [
      {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
    ],
    stripe: false,
    border: false,
    highCurrent: false,
    size: 'M',
  },
};

export default meta;
type Story = StoryObj<typeof meta>

import './table.css';

export const Default: Story = {
  name: '基础用法',
  args: {},
  render: (args) => ({
    components: { CaTable, CaTableColumn },
    setup() {
      return { args };
    },
    template: `
      <CaTable :data="args.data"
               :max-height="args.maxHeight"
               :stripe="args.stripe"
               :border="args.border"
               :highCurrent="args.highCurrent"
               :size="args.size">
        <CaTableColumn prop="date" label="日期" />
        <CaTableColumn prop="name" label="姓名" />
        <CaTableColumn prop="address" label="地址" />
      </CaTable>`,
  }),
};

export const CustomColumnClassName: Story = {
  name: '自定义列的类名',
  args: {},
  render: (args) => ({
    components: { CaTable, CaTableColumn },
    setup() {
      const cls = (prop: string) => {
        if (prop === 'name') {
          return 'fun-str';
        }
        return '';
      };
      return { args, cls };
    },
    template: `
      <div class="custom-column-class-name">
        <CaTable :data="args.data" :max-height="args.maxHeight">
          <CaTableColumn prop="date" label="日期" :width="130" :columnClassName="'col-str'" />
          <CaTableColumn prop="name" label="姓名" :width="50" :columnClassName="cls" />
          <CaTableColumn prop="address" label="地址" :columnClassName="cls" />
        </CaTable>
      </div>`,
  }),
};

export const CustomColumnStyle: Story = {
  name: '自定义列的样式',
  args: {},
  render: (args) => ({
    components: { CaTable, CaTableColumn },
    setup() {
      const styles: CSSProperties = { backgroundColor: 'red', color: '#ffffff' };
      const stylesF = (key: string): CSSProperties => {
        if (key === 'name') {
          return { backgroundColor: 'blue', color: '#ffffff' };
        }
        return {};
      };
      return { args, styles, stylesF };
    },
    template: `
      <div class="custom-column-class-name">
        <CaTable :data="args.data" :max-height="args.maxHeight">
          <CaTableColumn prop="date" label="日期" :width="130" :columnStyle="styles" />
          <CaTableColumn prop="name" label="姓名" :width="50" :columnStyle="stylesF" />
          <CaTableColumn prop="address" label="地址" :columnStyle="stylesF" />
        </CaTable>
      </div>`,
  }),
};

export const CustomRowClassName: Story = {
  name: '自定义行的类名',
  args: {},
  render: (args) => ({
    components: { CaTable, CaTableColumn },
    setup() {
      const cls = (prop: string) => {
        if (prop === 'name') {
          return 'fun-str';
        }
        return '';
      };
      return { args, cls };
    },
    template: `
      <div class="custom-row-class-name">
        <CaTable :data="args.data" :max-height="args.maxHeight" :rowClassName="'row-str'">
          <CaTableColumn prop="date" label="日期" :width="130" />
          <CaTableColumn prop="name" label="姓名" :width="50" />
          <CaTableColumn prop="address" label="地址" />
        </CaTable>
      </div>`,
  }),
};

export const CustomRowStyle: Story = {
  name: '自定义行的样式',
  args: {},
  render: (args) => ({
    components: { CaTable, CaTableColumn },
    setup() {
      const stylesF = (rowVal: { date: string; name: string; address: string }, index: number): CSSProperties => {
        if (rowVal.date === '2016-05-03') {
          return { backgroundColor: 'blue', color: '#ffffff' };
        }
        return { backgroundColor: '#aaaaaa' };
      };
      return { args, stylesF };
    },
    template: `
      <div class="custom-row-style">
        <CaTable :data="args.data" :max-height="args.maxHeight" :rowStyle="stylesF">
          <CaTableColumn prop="date" label="日期" :width="130" />
          <CaTableColumn prop="name" label="姓名" :width="50" />
          <CaTableColumn prop="address" label="地址" />
        </CaTable>
      </div>`,
  }),
};

export const CustomCellClassName: Story = {
  name: '自定义单元格的类名',
  args: {},
  render: (args) => ({
    components: { CaTable, CaTableColumn },
    setup() {
      // 完善 cls 方法：根据 prop 和 rowIndex 返回不同的类名
      const cls = (
        row: any,
        prop: string,
        rowIndex: number,
        columnIndex: number,
      ): string => {
        if (rowIndex % 2 === 0) {
          return 'cell-even';
        }
        return '';
      };
      return { args, cls };
    },
    template: `
      <!-- 使用独立的类名包裹，便于在 CSS 中限定作用域 -->
      <div class="custom-cell-class-name">
        <CaTable :data="args.data" :max-height="args.maxHeight" :cellClassName="cls">
          <CaTableColumn prop="date" label="日期" :width="130" />
          <CaTableColumn prop="name" label="姓名" :width="50" />
          <CaTableColumn prop="address" label="地址" />
        </CaTable>
      </div>`,
  }),
};

export const CustomCellStyle: Story = {
  name: '自定义单元格的样式',
  args: {},
  render: (args) => ({
    components: { CaTable, CaTableColumn },
    setup() {
      // 完善 stylesF 方法：根据 prop 和 rowIndex 返回不同的样式对象
      const stylesF = (row: any, prop: string, rowIndex: number, columnIndex: number): CSSProperties => {
        const style: CSSProperties = {};
        // 姓名列文字设为红色
        if (prop === 'name') {
          style.color = 'red';
        }
        if (rowIndex % 2 === 1) {
          style.backgroundColor = '#d0d0d0';
        }
        if (prop === 'date') {
          style.fontWeight = 'bold';
        }
        return style;
      };
      return { args, stylesF };
    },
    template: `
      <div class="custom-cell-style">
        <CaTable :data="args.data" :max-height="args.maxHeight" :cellStyle="stylesF">
          <CaTableColumn prop="date" label="日期" :width="130" />
          <CaTableColumn prop="name" label="姓名" :width="50" />
          <CaTableColumn prop="address" label="地址" />
        </CaTable>
      </div>`,
  }),
};

export const MaxHeight: Story = {
  name: '设置表格最大高度',
  args: {},
  render: (args) => ({
    components: { CaTable, CaTableColumn },
    setup() {
      return { args };
    },
    template: `
      <CaTable :data="args.data" :max-height="args.maxHeight">
        <CaTableColumn prop="date" label="日期" :width="130" />
        <CaTableColumn prop="name" label="姓名" :minWidth="110" />
        <CaTableColumn prop="address" label="地址" />
      </CaTable>`,
  }),
};

export const Sort: Story = {
  name: '排序表格',
  args: {
    data: [
      {
        name: 'Charlie',              // string
        age: 32,                      // number
        isVip: true,                  // boolean
        scoreInfo: { rank: 3, score: 85.5 }, // object (用于嵌套/字段排序)
      },
      {
        name: 'Alice',
        age: 19,
        isVip: false,
        scoreInfo: { rank: 1, score: 98.0 },
      },
      {
        name: 'Eve',
        age: 45,
        isVip: true,
        scoreInfo: { rank: 5, score: 72.0 },
      },
      {
        name: 'Bob',
        age: 28,
        isVip: false,
        scoreInfo: { rank: 2, score: 91.5 },
      },
      {
        name: 'David',
        age: 37,
        isVip: true,
        scoreInfo: { rank: 4, score: 78.0 },
      },
    ],
  },
  render: (args) => ({
    components: { CaTable, CaTableColumn },
    setup() {
      let data = args.data;
      const sortByScore = (a: any, b: any) => a.score - b.score;
      return { args, sortByScore };
    },
    template: `
      <CaTable :data="args.data" :max-height="args.maxHeight">
        <CaTableColumn prop="name" label="姓名" sortable :width="80" />
        <CaTableColumn prop="age" label="年龄" sortable :width="80" />
        <CaTableColumn prop="isVip" label="VIP会员" sortable>
          <template #default="{ row }">
            {{ row.isVip ? '是' : '否' }}
          </template>
        </CaTableColumn>
        <CaTableColumn
          prop="scoreInfo"
          label="积分"
          sortable
          :sort-method="sortByScore"
        >
          <template #default="{ row }">
            {{ row.scoreInfo.score }} (排名: {{ row.scoreInfo.rank }})
          </template>
        </CaTableColumn>
      </CaTable>`,
  }),
};

export const ChangeWidth: Story = {
  name: '动态改变宽度',
  args: {},
  render: (args) => ({
    components: { CaTable, CaTableColumn },
    setup() {
      const w1 = ref<number>(150);
      const add = () => {
        w1.value += 10;
      };
      const reduce = () => {
        w1.value -= 10;
      };
      return { args, w1, add, reduce };
    },
    template: `
      <div style="display: flex; align-items: center;justify-content: flex-start; gap: 12px;">
        <button @click="add">Add</button>
        <button @click="reduce">Reduce</button>
      </div>
      <CaTable :data="args.data" :max-height="args.maxHeight">
        <CaTableColumn prop="date" label="日期" :width="w1" />
        <CaTableColumn prop="name" label="姓名" :width="230" />
        <CaTableColumn prop="address" label="地址" />
      </CaTable>`,
  }),
};