import React from 'react';

const defaultScrollToOptions: ScrollToOptions = { behavior: 'smooth' };

export type Pager = {
  back: (options?: ScrollToOptions) => void;
  forward: (options?: ScrollToOptions) => void;
  goToSlide: (n: number, options?: ScrollToOptions) => void;
};

export const createPager = (ref: React.RefObject<HTMLDivElement>): Pager => {
  const ua = navigator.userAgent.toLowerCase();
  const isSafari = ua.indexOf('safari');

  const page = (dir: number, options: ScrollToOptions = defaultScrollToOptions) => {
    const el = ref.current;

    if (!el) return;

    const { scrollLeft, offsetWidth } = el;
    const offset = isSafari ? 8 * dir : 0;
    const left = scrollLeft + offsetWidth * dir + offset;

    el.scrollTo({ ...options, left });
  };

  return {
    back: (options?: ScrollToOptions) => page(-1, options),
    forward: (options?: ScrollToOptions) => page(1, options),
    goToSlide: (n: number, options = defaultScrollToOptions) => {
      const sliderEl = ref.current;

      if (sliderEl != null) {
        const slides = Array.from(sliderEl.children) as HTMLDivElement[];
        const startSlide = slides.find((s) => s.dataset?.duplicate === 'false' && s.dataset?.index === n.toString());

        if (startSlide != null) {
          const left = startSlide?.offsetLeft;

          sliderEl.scrollTo({ ...options, left });
        }
      }
    },
  };
};
