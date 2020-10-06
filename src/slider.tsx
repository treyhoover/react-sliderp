import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import debounce from 'lodash.debounce';
import smoothscroll from 'smoothscroll-polyfill';

smoothscroll.polyfill();

export interface SliderProps<Slide> {
  className?: string;
  slides: Slide[];
  children: (slide: Slide, index: number) => React.ReactElement;
  sliderRef?: React.RefObject<HTMLDivElement>;
  scrollEndDebounce?: number;
  onChange?: (current: number) => void;
  infinite?: boolean;
}

function duplicateSlides<Slide>(slides: Slide[]) {
  return [...slides, ...slides, ...slides];
}

export function Slider<Slide = any>({
  slides,
  children: render,
  sliderRef,
  scrollEndDebounce = 150,
  onChange,
  infinite = false,
  ...props
}: SliderProps<Slide>) {
  const lastIndex = useRef(0);
  const renderedSlides = useMemo(() => (infinite ? duplicateSlides<Slide>(slides) : slides), [slides, infinite]);

  // Adjust scroll position to center
  const recenterInfinite = (target: HTMLDivElement) => {
    const pageWidth = target.scrollWidth / 3;
    const [minLeft, maxLeft] = [pageWidth, pageWidth * 2];

    if (target.scrollLeft < minLeft) {
      target.scrollLeft += pageWidth;
    } else if (target.scrollLeft > maxLeft) {
      target.scrollLeft -= pageWidth;
    }
  };

  // Set initial position
  useLayoutEffect(() => {
    const sliderEl = sliderRef?.current;

    if (sliderEl != null) {
      sliderEl.scrollLeft = infinite ? sliderEl.scrollWidth / 3 : 0;
    }
  }, [infinite]);

  const onScrollEnd = useCallback(
    debounce((target: HTMLDivElement) => {
      if (infinite) {
        recenterInfinite(target);
      }

      const slides = Array.from(target.children ?? []) as HTMLDivElement[];
      const currentSlide = slides.find((s) => s.offsetLeft >= target.scrollLeft);
      const currentIndex = parseInt(currentSlide?.dataset?.index ?? '0', 10);

      if (typeof onChange === 'function') {
        lastIndex.current = currentIndex;
        onChange(currentIndex);
      }
    }, scrollEndDebounce),
    [infinite],
  );

  return (
    <div
      ref={sliderRef}
      {...props}
      style={{
        scrollSnapType: 'x mandatory',
        scrollPadding: 0,
        scrollMargin: 0,
        scrollSnapMargin: 0,
        overflowX: 'scroll',
        whiteSpace: 'nowrap',
      }}
      onScroll={(e) => onScrollEnd(e.currentTarget)}
    >
      {renderedSlides.map((slide, i) => (
        <div
          key={i}
          data-index={i % slides.length}
          data-duplicate={infinite ? i < slides.length || i > slides.length * 2 - 1 : false}
          style={{ scrollSnapAlign: 'start', display: 'inline-block', verticalAlign: 'top' }}
        >
          {render(slide, i)}
        </div>
      ))}
    </div>
  );
}
