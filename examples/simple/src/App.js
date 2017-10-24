import React from 'react';
import { Slider, createScroller } from "react-sliderp";
import InputBox from "./InputBox";
import "./App.css";

let demoSlides = [];

for (let i = 0; i < 100; i++) {
  demoSlides.push(i);
}

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      aspectRatio: "16:9",
      maxSlideWidth: 400,
      slides: demoSlides,
      index: 0,
      containerWidth: 0,
      slidesToShow: 4,
    };

    const getScrollState = () => ({
      index: this.state.index,
      numSlides: this.state.slides.length,
      slidesToShow: this.state.slidesToShow,
    });

    this.scroller = createScroller(getScrollState, this.setIndex);
  }

  setIndex = (index) => {
    this.setState({ index });
  };

  handleArrowKey = (e) => {
    if (e.key === "ArrowRight") {
      this.scroller.pageRight();
    } else if (e.key === "ArrowLeft") {
      this.scroller.pageLeft();
    }
  };

  handleResize = ({ width }) => {
    if (width !== this.state.containerWidth) {
      this.setState({ containerWidth: width })
    }
  };

  render() {
    const { slides, index, containerWidth, slidesToShow } = this.state;

    return (
      <div>
        <h1>Simple demo</h1>
        <p>Navigate with controls, arrow keys, or by scrolling/swiping</p>

        <Slider
          index={index}
          className="slider"
          slides={slides}
          width={containerWidth}
          height={250}
          slidesToShow={slidesToShow}
          onScroll={this.scroller.update}
          onArrow={this.handleArrowKey}
          onResize={this.handleResize}
          scrollable
          swipeable
        >
          {({ slide, index }) => (
            <div
              className="slide"
              style={{
                background: index % 2 === 0 ? "#1CE" : "#C0FF33",
              }}
            >
              {slide}
            </div>
          )}
        </Slider>

        <button onClick={(e) => this.scroller.pageLeft()}>{'<<<'}</button>
        <button onClick={(e) => this.scroller.slideLeft()}>{'<'}</button>
        <InputBox onUpdate={this.scroller.update}>{index}</InputBox>
        <button onClick={(e) => this.scroller.slideRight()}>{'>'}</button>
        <button onClick={(e) => this.scroller.pageRight()}>{'>>>'}</button>
      </div>
    );
  }
}

export default App;
