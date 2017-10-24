import React from 'react';
import { Slider, createScroller } from "react-sliderp";
import InputBox from "./InputBox";
import "./App.css";

const colors = ["AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "Darkorange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSlateGrey", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"];

const createSlide = (i) => ({
  color: colors[i],
});

let demoSlides = [];

for (let i = 0; i < 3; i++) {
  demoSlides.push(createSlide(i));
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
    };

    const getScrollState = () => ({
      index: this.state.index,
      numSlides: this.state.slides.length,
      slidesToShow: this.slidesToShow,
    });

    this.scroller = createScroller(getScrollState, this.setIndex);
  }

  setIndex = (index) => {
    this.setState({ index });
  };

  get sliderHeight() {
    if (this.slidesToShow <= 0) return 0;

    const { aspectRatio } = this.state;
    const sliderWidth = this.state.containerWidth;
    const [w, h] = aspectRatio.split(":").map(Number);
    const slideWidth = sliderWidth / this.slidesToShow;

    return slideWidth * h / w;
  }

  get slidesToShow() {
    const { maxSlideWidth } = this.state;
    const sliderWidth = this.state.containerWidth;

    if (!sliderWidth || sliderWidth <= 0) return 1;

    return Math.max(1, Math.ceil(sliderWidth / maxSlideWidth));
  }

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

  addSlide = (i) => {
    const { slides } = this.state;
    const newSlides = slides.concat(createSlide(i));

    this.setState({ slides: newSlides });
  };

  removeSlide = (index) => {
    const { slides } = this.state;

    const newSlides = [
      ...slides.slice(0, index),
      ...slides.slice(index + 1),
    ];

    this.setState({ slides: newSlides });
  };

  handleSizeChange = e => {
    const maxSlideWidth = Number(e.target.value);

    this.setState({ maxSlideWidth });
  };

  render() {
    const { slides, index, containerWidth } = this.state;

    return (
      <div>
        <h1>Dynamic demo</h1>
        <p>Navigate with controls, arrow keys, or by scrolling/swiping</p>

        <div className="swatches">
          <p>Click a color to add it as a slide</p>

          {colors.map((color, i) => <div
            className="swatch"
            key={i}
            style={{ background: color }}
            onClick={(e) => this.addSlide(i)}
          />)}
        </div>

        <Slider
          index={index}
          className="slider"
          slides={slides}
          width={containerWidth}
          height={this.sliderHeight}
          slidesToShow={this.slidesToShow}
          onScroll={this.scroller.update}
          onArrow={this.handleArrowKey}
          onResize={this.handleResize}
          scrollable
          swipeable
        >
          {({ slide, index }) => (
            <div
              className="slide-inner"
              style={{
                color: slide.color,
                fontSize: this.state.maxSlideWidth / 10
              }}
            >
              <label>{slide.color}</label>
              <button onClick={(e) => this.removeSlide(index)}>Remove</button>
            </div>
          )}
        </Slider>

        <label>Max slide width: {this.state.maxSlideWidth}</label>
        <input
          className="size"
          type="range"
          min={100}
          max={1000}
          step={10}
          value={this.state.maxSlideWidth}
          onChange={this.handleSizeChange}
        />

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
