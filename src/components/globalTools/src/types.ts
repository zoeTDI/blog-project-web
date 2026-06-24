type ToolType = 'theme' | 'fullscreen' | 'timezone' | 'language';

type ToolShape = 'rounded' | 'circle';

interface ButtonProps {
  shape?: ToolShape;
}

export type { ToolType, ToolShape, ButtonProps };
