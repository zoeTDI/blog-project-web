import { CaCol } from '@/components/ca/caCol';
import { CaRow } from '@/components/ca/CaRow';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'Component/Ca/CaCol',
  component: CaCol,
  subcomponents: { CaRow },
  tags: ['autodocs'],
  argTypes: {
    span: {
      control: 'number',
      description: '跨越的列数',
    },
    offset: {
      control: 'number',
      description: '偏移的列数',
    },
    pull: {
      control: 'number',
      description: '原地向左偏移的列数, 会遮挡其他列',
    },
    push: {
      control: 'number',
      description: '原地向右偏移的列数, 会遮挡其他列',
    },
  },
} satisfies Meta<typeof CaCol>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => ({
    components: { CaRow, CaCol },
    setup() {
      return { args };
    },
    template: `
      <CaRow :gap="20">
        <CaCol :span="24">
          <div style="background: #d3dce6; padding: 10px 0;text-align: center">24</div>
        </CaCol>
        <CaCol v-for="i in 2" :key="i" :span="24/2">
          <div style="background: #d3dce6; padding: 10px 0;text-align: center">{{ 24 / 2 }}</div>
        </CaCol>
        <CaCol v-for="i in 3" :key="i" :span="24/3">
          <div style="background: #d3dce6; padding: 10px 0;text-align: center">{{ 24 / 3 }}</div>
        </CaCol>
        <CaCol v-for="i in 4" :key="i" :span="24/4">
          <div style="background: #d3dce6; padding: 10px 0;text-align: center">{{ 24 / 4 }}</div>
        </CaCol>
        <CaCol v-for="i in 6" :key="i" :span="24/6">
          <div style="background: #d3dce6; padding: 10px 0;text-align: center">{{ 24 / 6 }}</div>
        </CaCol>
        <CaCol v-for="i in 12" :key="i" :span="24/12">
          <div style="background: #d3dce6; padding: 10px 0;text-align: center">{{ 24 / 12 }}</div>
        </CaCol>
        <CaCol v-for="i in 24" :key="i" :span="24/24">
          <div style="background: #d3dce6; padding: 10px 0;text-align: center">{{ 24 / 24 }}</div>
        </CaCol>
      </CaRow>
    `,
  }),
};

export const Offset: Story = {
  args: {},
  render: (args) => ({
    components: { CaRow, CaCol },
    setup() {
      return { args };
    },
    template: `
      <CaRow>
        <CaCol :span="12" :offset="3">
          <div style="background: #d3dce6; padding: 10px 0;text-align: center">col:span=12;offset=3</div>
        </CaCol>
        <CaCol :span="3" :offset="1">
          <div style="background: #d3dce6; padding: 10px 0;text-align: center">col:span=3;offset=1</div>
        </CaCol>
      </CaRow>
      <CaRow>
        <CaCol :span="3">
          <div style="background: #d3dce6; padding: 10px 0;text-align: center">col:span=3</div>
        </CaCol>
        <CaCol :span="3" :offset="4">
          <div style="background: #d3dce6; padding: 10px 0;text-align: center">col:span=3;offset=4</div>
        </CaCol>
      </CaRow>
    `,
  }),
};

export const Pull: Story = {
  args: {},
  render: (args) => ({
    components: { CaRow, CaCol },
    setup() {
      return { args };
    },
    template: `
      <CaRow>
        <CaCol :span="12">
          <div style="background: #d3dce6; padding: 10px 0;text-align: center">col:span=12</div>
        </CaCol>
      </CaRow>
      <CaRow>
        <CaCol :span="12" :offset="6">
          <div style="background: #d3dce6; padding: 10px 0;text-align: center">col:span=12;offset=6</div>
        </CaCol>
      </CaRow>
      <CaRow>
        <CaCol :span="4" style="outline: 1px dashed red; margin-top: 10px;">
          <div style="background: #d3dce6; padding: 10px 0;text-align: center">col:span=3 被遮住了</div>
        </CaCol>
        <CaCol :span="12" :offset="2" :pull="3" style="outline: 1px dashed blue">
          <div style="background: #d3dce6; padding: 10px 0;text-align: center">col:span=12;offset=2;pull=3</div>
        </CaCol>
      </CaRow>
    `,
  }),
};

export const Push: Story = {
  args: {},
  render: (args) => ({
    components: { CaRow, CaCol },
    setup() {
      return { args };
    },
    template: `
      <CaRow>
        <CaCol :span="12" style="outline: 1px dashed red">
          <div style="background: #d3dce6; padding: 10px 0;text-align: center">col:span=12</div>
        </CaCol>
      </CaRow>
      <CaRow>
        <CaCol :span="12" :offset="6" style="outline: 1px dashed red">
          <div style="background: #d3dce6; padding: 10px 0;text-align: center">col:span=12;offset=6</div>
        </CaCol>
      </CaRow>
      <CaRow>
        <CaCol :span="12" :offset="6" :push="3" style="outline: 1px dashed red">
          <div style="background: #d3dce6; padding: 10px 0;text-align: center">col:span=12;offset=6;push=3</div>
        </CaCol>
        <CaCol :span="6" style="outline: 1px dashed red; margin-top: 10px;">
          <div style="background: #d3dce6; padding: 10px 0;text-align: center">col:span=3 被遮住了</div>
        </CaCol>
      </CaRow>
    `,
  }),
};
