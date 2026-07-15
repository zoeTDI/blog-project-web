import {
  CaSelect,
  CaSelectOption,
  CaSelectGroup,
} from '@/components/ca/caSelect';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'Component/Ca/CaSelect',
  component: CaSelect,
  subcomponents: { CaSelectOption, CaSelectGroup },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
    },
  },
  args: {},
} satisfies Meta<typeof CaSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => ({
    components: { CaSelect, CaSelectOption },
    setup() {
      return { args };
    },
    template: `
      <CaSelect v-bind="args">
        <CaSelectOption v-for="i in 10" :key="i">{{ i }} value</CaSelectOption>
      </CaSelect>
    `,
  }),
};

export const Group: Story = {
  args: {
    options: [
      {
        label: 'Group 1',
        options: ['Value 1', 'Value 2', 'Value 3'],
      },
      {
        label: 'Group 2',
        options: ['Value 1', 'Value 2', 'Value 3'],
      },
    ],
  },
  render: (args) => ({
    components: { CaSelect, CaSelectGroup, CaSelectItem: CaSelectOption },
    setup() {
      return { args };
    },
    template: `
      <CaSelect>
        <CaSelectGroup v-for="group in args.options" :key="group.label" :label="group.label">
          <CaSelectOption v-for="option in group.options" :key="option">{{ option }}</CaSelectOption>
        </CaSelectGroup>
      </CaSelect>
    `,
  }),
};
