import type { ValueOf } from '#/utils';

interface SidebarOption {
  isShow?: boolean;
}

const CONTENT_LAYOUT_MODE_OPTION = {
  FULL: 'full',
  CENTERED: 'centered',
} as const;

type ContentLayoutModeOption = ValueOf<typeof CONTENT_LAYOUT_MODE_OPTION>;

interface ContentLayoutProps {
  left?: SidebarOption;
  right?: SidebarOption;
  mode?: ContentLayoutModeOption;
}

export { CONTENT_LAYOUT_MODE_OPTION };
export type { SidebarOption, ContentLayoutProps, ContentLayoutModeOption };
