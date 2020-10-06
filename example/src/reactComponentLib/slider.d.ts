import React from 'react';
export interface SliderProps<Slide> {
    className?: string;
    slides: Slide[];
    children: (slide: Slide, index: number) => React.ReactElement;
    sliderRef?: React.RefObject<HTMLDivElement>;
    scrollEndDebounce?: number;
    onChange?: (current: number) => void;
    infinite?: boolean;
}
export declare function Slider<Slide = any>({ slides, children: render, sliderRef, scrollEndDebounce, onChange, infinite, ...props }: SliderProps<Slide>): JSX.Element;
