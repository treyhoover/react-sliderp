import React from 'react';
export declare type Pager = {
    back: (options?: ScrollToOptions) => void;
    forward: (options?: ScrollToOptions) => void;
    goToSlide: (n: number, options?: ScrollToOptions) => void;
};
export declare const createPager: (ref: React.RefObject<HTMLDivElement>) => Pager;
