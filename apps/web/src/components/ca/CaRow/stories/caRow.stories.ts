import { CaRow } from '@/components/ca/CaRow';
import { CaCol } from '@/components/ca/caCol';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'Component/Ca/CaRow',
  component: CaRow,
  subcomponents: { CaCol },
  tags: ['autodocs'],
  argTypes: {
    gap: {
      control: 'number',
      description: '栅格间距 (px)',
    },
    justify: {
      control: 'select',
      options: [
        'start',
        'center',
        'end',
        'space-around',
        'space-between',
        'space-evenly',
      ],
      description: '水平对齐方式',
    },
    align: {
      control: 'select',
      options: ['top', 'middle', 'bottom'],
      description: '垂直对齐方式',
    },
  },
} satisfies Meta<typeof CaRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    gap: 0,
  },
  render: (args) => ({
    components: { CaRow, CaCol },
    setup() {
      return { args };
    },
    template: `
      <CaRow v-bind="args">
        <CaCol :span="24" >
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

export const Justify: Story = {
  args: {
    justify: 'start',
  },
  render: (args) => ({
    components: { CaRow, CaCol },
    setup() {
      return { args };
    },
    template: `
      <CaRow v-bind="args">
        <CaCol :span="8">
          <div style="background: #d3dce6;">Span 8</div>
        </CaCol>
        <CaCol :span="8">
          <div style="background: #d3dce6;">Span 8</div>
        </CaCol>
      </CaRow>
    `,
  }),
};

export const Align: Story = {
  args: {
    align: 'top',
  },
  render: (args) => ({
    components: { CaRow, CaCol },
    setup() {
      return { args };
    },
    template: `
      <CaRow v-bind="args">
        <CaCol :span="16">
          <div style="background: #d3dce6; padding: 10px 0;text-align: center">16</div>
          <CaRow>
            <CaCol :span="16">
              <div style="background: #d3dce6; padding: 10px 0;text-align: center">16</div>
            </CaCol>
            <CaCol :span="8">
              <div style="background: #d3dce6; padding: 10px 0;text-align: center">8</div>
            </CaCol>
          </CaRow>
        </CaCol>
        <CaCol :span="8">
          <div style="background: #d3dce6; padding: 10px 0;text-align: center">8</div>
        </CaCol>
      </CaRow>
    `,
  }),
};

