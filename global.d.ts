declare namespace JSX {
  interface IntrinsicElements {
    // 'iconify-icon': any;
    'iconify-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
          icon?: string;
          style?: string | number;
          width?: string | number;
          height?: string | number;
          color?: string;
        };
  }
}
