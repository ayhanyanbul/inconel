import { Props as ReactSVGProps } from 'react-svg';
export interface SvgProps extends Omit<ReactSVGProps, 'className' | 'src' | 'title' | 'wrapper'> {
    className?: string;
    src?: string | null;
    title?: string | null;
    render?: boolean;
}
declare function Svg({ className, src, title, render, ...svgProps }: SvgProps): import("react").JSX.Element | null;
export default Svg;
//# sourceMappingURL=Svg.d.ts.map