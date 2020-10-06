import React, { useState } from 'react';
import { createPager, Slider } from 'react-sliderp';

const dummySlides = new Array(50).fill(0).map((n, i) => i);

function App() {
  const [infinite, setInfinite] = useState(false);
  const [currentSlide, setCurrentSlide] = useState('0');
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const pager = createPager(sliderRef);

  return (
    <>
      <Slider<number>
        className="slider"
        sliderRef={sliderRef}
        slides={dummySlides}
        infinite={infinite}
        onChange={(n) => setCurrentSlide(String(n))}
      >
        {(slide, i) => (
          <div
            style={{
              width: '25vw',
              height: '100px',
              background: i % 2 === 0 ? 'lightblue' : 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {slide}
          </div>
        )}
      </Slider>

      <div>
        <button onClick={(e) => pager.back()}>Prev page</button>
        <input
          type="text"
          value={currentSlide}
          onChange={(e) => {
            pager.goToSlide(parseInt(e.target.value, 10));
            setCurrentSlide(e.target.value);
          }}
        />
        <button onClick={(e) => pager.forward()}>Next page</button>
      </div>

      <div>
        <label htmlFor="infinite-mode">Infinite</label>
        <input id="infinite-mode" type="checkbox" checked={infinite} onChange={() => setInfinite((inf) => !inf)} />
      </div>
    </>
  );
}

export default App;
