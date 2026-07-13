import { CaSelect } from '@/components/ca/caSelect';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'Component/Ca/CaSelect',
  component: CaSelect,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
    },
  },
  args: {
  },
} satisfies Meta<typeof CaSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => ({
    components: { CaSelect },
    setup() {
      return { args };
    },
    template: `
      <CaSelect v-bind="args"></CaSelect>
    `,
  }),
};
