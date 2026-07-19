interface CaImageViewProps {
  url: string;
}

interface CaImageViewEmits {
  (e: 'close'): void;
}

interface CaImageViewerExpose {
  open: () => void;
  close: () => void;
}

interface CaImageProps {
  src: string;
  alt?: string;
  preview?: boolean;
}

export type {
  CaImageViewProps,
  CaImageViewEmits,
  CaImageViewerExpose,
  CaImageProps,
};
